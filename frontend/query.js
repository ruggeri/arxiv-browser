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

export const isAuthorStarred = (state, {author, authorId}) => {
  if (author) {
    authorId = author.get('id');
  }

  const authorStatus = state.authorStatuses.get(authorId);
  return authorStatus && authorStatus.get('isStarred');
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

export const papersForAuthorId = (state, authorId) => {
  const authorshipsByAuthorId = state.authorships.get('byAuthorId');
  const authorships = authorshipsByAuthorId.get(authorId, I.Set());
  const papers = authorships.map(
    as => state.papers.get(as.get('paperId'))
  ).filter(p => !!p).sortBy(p => p.get('publicationDateTime'));

  return papers
};
