export const authorStatusByAuthorId(state, {author, authorId}) {
  if (author) {
    authorId = author.get('id');
  }

  return state.authorStatuses.get(authorId);
}
