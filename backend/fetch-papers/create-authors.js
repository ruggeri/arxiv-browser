const models = require('../models');
const createAuthorStatus = require('./create-author-status');

async function createAuthor(tx, authorJSON) {
  const authorAttrs = {
    name: authorJSON["name"]["#"]
  }

  let [author, didCreate] = [(await (
    tx
      .select('authors.*')
      .from('authors')
      .where({name: authorAttrs.name})
      .first()
  )), false];

  if (!author) {
    [author, didCreate] = [(await (
      tx
        .insert({...authorAttrs, createdAt: models.knex.fn.now()})
        .into('authors')
        .returning('*')
    ))[0], true];
  }

  await createAuthorStatus(tx, author);

  return {author, didCreate};
}

module.exports = async function createAuthors(tx, authorsJSON) {
  if (!Array.isArray(authorsJSON)) {
    // This happens when there is a sole author I think.
    return await createAuthors(tx, [authorsJSON]);
  }

  const authors = [];
  let numCreated = 0;
  for (const authorJSON of authorsJSON) {
    const {author, didCreate} = await createAuthor(tx, authorJSON);
    authors.push(author);
    if (didCreate) {
      numCreated += 1;
    }
  }

  return {
    authors,
    numCreated,
  }
};
