import I from 'immutable';

export const authorsForPaper = (state, {paper, paperId}) => {
  if (paper) {
    paperId = paper.get('id');
  }

  const authorshipsByPaperId = state.authorships.get('byPaperId');
  const authorships = authorshipsByPaperId.get(paperId, I.Set());
  const authors = authorships.map(
    as => state.authors.get(as.get('authorId'))
  ).filter(a => !!a).sortBy(a => a.get('name'));

  return authors;
}

export const getAuthorById = (state, authorId) => {
  return state.authors.get(authorId);
}

export const isAuthorStarred = (state, {author, authorId}) => {
  if (author) {
    authorId = author.get('id');
  }

  const authorStatus = state.authorStatuses.get(authorId);
  return authorStatus && authorStatus.get('isStarred');
}
