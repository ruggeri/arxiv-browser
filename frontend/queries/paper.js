import I from 'immutable';

export const getPaperById = (state, paperId) => {
  return state.papers.get(paperId);
}

export const isPaperArchived = (state, {paper, paperId}) => {
  if (paper) {
    paperId = paper.get('id');
  }

  const paperStatus = state.paperStatuses.get(paperId);
  return paperStatus && paperStatus.get('isArchived');
}

export const isPaperStarred = (state, {paper, paperId}) => {
  if (paper) {
    paperId = paper.get('id');
  }

  const paperStatus = state.paperStatuses.get(paperId);
  return paperStatus && paperStatus.get('isStarred');
}

export const papersForAuthor = (state, {author, authorId}) => {
  if (author) {
    authorId = author.get('id');
  }

  const authorshipsByAuthorId = state.authorships.get('byAuthorId');
  const authorships = authorshipsByAuthorId.get(authorId, I.Set());
  const papers = authorships.map(
    as => state.papers.get(as.get('paperId'))
  ).filter(p => !!p).sortBy(p => p.get('publicationDateTime'));

  return papers
};
