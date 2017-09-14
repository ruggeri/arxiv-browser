import I from 'immutable';

export const authorsByPaperId = (state, papers) => {
  let paperIds;
  if (I.isAssociative(papers)) {
    paperIds = papers.keySeq();
  } else {
    paperIds = papers;
  }

  let authorsByPaperId = I.Map();
  for (const paperId of paperIds) {
    const authors = authorsForPaperId(state, paperId);
    authorsByPaperId = authorsByPaperId.set(paperId, authors);
  }

  return authorsByPaperId;
};

export const authorsForPaperId = (state, paperId) => {
  const authorshipsByPaperId = state.authorships.get('byPaperId');
  const authorships = authorshipsByPaperId.get(paperId, I.Set());
  const authors = authorships.map(
    as => state.authors.get(as.get('authorId'))
  ).filter(a => !!a).sortBy(a => a.get('name'));

  return authors;
}

export const isPaperStarred = (state, {paper, paperId}) => {
  if (paper) {
    paperId = paper.get('id');
  }

  const paperStatus = state.paperStatuses.get(paperId);
  console.log(paperStatus.toJS());
  return paperStatus && paperStatus.get('isStarred');
}

export const papersForAuthorId = (state, authorId) => {
  const authorshipsByAuthorId = state.authorships.get('byAuthorId');
  const authorships = authorshipsByAuthorId.get(authorId, I.Set());
  const papers = authorships.map(
    as => state.papers.get(as.get('paperId'))
  ).filter(p => !!p).sortBy(p => p.get('publicationDateTime'));

  return papers
};
