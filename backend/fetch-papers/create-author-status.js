async function createAuthorStatus(tx, author) {
  await models.AuthorStatus.findOrCreate({
    where: {authorId: author.id},
    defaults: {isStarred: false},
    transaction: tx,
  });
}
