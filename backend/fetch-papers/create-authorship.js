async function createAuthorships(tx, paper, authors) {
  for (author of authors) {
    await models.Authorship.findOrCreate({
      where: {paperId: paper.id, authorId: author.id},
      transaction: tx
    });
  }
}
