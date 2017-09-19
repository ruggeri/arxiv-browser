const models = require('../models');

async function createAuthorship(tx, paper, author) {
  let [authorship, didCreate] = [(await (
    tx
      .select('authorships.*')
      .from('authorships')
      .where({paperId: paper.id, authorId: author.id})
      .first()
  )), false];

  if (!authorship) {
    [authorship, didCreate] = [(await (
      tx
        .insert({
          paperId: paper.id,
          authorId: author.id,
          createdAt: models.knex.fn.now(),
        })
        .into('authorships')
        .returning('*')
    ))[0], true];
  }

  return {authorship, didCreate};
}

module.exports = async function createAuthorships(tx, paper, authors) {
  const authorships = [];
  let numCreated = 0;
  for (let author of authorships) {
    const [authorship, didCreate] = await (
      createAuthorship(tx, paper, author)
    );

    authorships.push(authorship);
    if (didCreate) {
      numCreated += 1;
    }
  }

  return {authorships, numCreated};
};
