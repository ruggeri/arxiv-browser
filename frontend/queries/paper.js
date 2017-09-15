import I from 'immutable';
import { _authorId, authorsForPaper, isAuthorStarred } from 'queries/author';

export function _paperId({paper, paperId}) {
  if (paper) {
    paperId = paper.get('id');
  }

  if (!paperId) {
    throw "No paper id given?";
  }

  return paperId;
}

export const getAllPapers = (state) => {
  return state.papers.valueSeq().toList();
}

export const getPaperById = (state, paperId) => {
  return state.papers.get(paperId);
}

export const hasStarredAuthor = (state, paperOrId) => {
  const paperId = _paperId(paperOrId);

  const authors = authorsForPaper(state, {paperId});
  return authors.some(a => isAuthorStarred(state, {author: a}));
}

export const isPaperArchived = (state, paperOrId) => {
  const paperId = _paperId(paperOrId);

  const paperStatus = state.paperStatuses.get(paperId);
  return paperStatus && paperStatus.get('isArchived');
}

export const isPaperStarred = (state, paperOrId) => {
  const paperId = _paperId(paperOrId);

  const paperStatus = state.paperStatuses.get(paperId);
  return paperStatus && paperStatus.get('isStarred');
}

export const papersForAuthor = (state, authorOrId) => {
  const authorId = _authorId(authorOrId);

  const authorshipsByAuthorId = state.authorships.get('byAuthorId');
  const authorships = authorshipsByAuthorId.get(authorId, I.Set());
  const papers = authorships.map(
    as => state.papers.get(as.get('paperId'))
  ).filter(p => !!p).sortBy(p => p.get('publicationDateTime'));

  return papers
};

export const searchPapers = (state, query, papers, {limitResults} = {}) => {
  query = query.toLowerCase();

  let matchedItems = papers.filter(paper => {
    if (paper.get('title').toLowerCase().includes(query)) {
      return true;
    }

    const authors = authorsForPaper(state, {paper});
    return authors.some(author => (
      author.get('name').toLowerCase().includes(query)
    ));
  });

  if (limitResults) {
    matchedItems = matchedItems.take(limitResults);
  }

  return matchedItems.toList();
}
