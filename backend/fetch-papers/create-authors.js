const models = require('./models');

async function createAuthor(tx, authorJSON) {
  const authorAttrs = {
    name: authorJSON["name"]["#"]
  }

  let [author, didCreate] = [await models.Author.findOne({
    where: {name: authorAttrs.name},
    transaction: tx
  }), false];
  if (!author) {
    [author, didCreate] = [new models.Author(), true];
  }

  author.set(authorAttrs);
  await author.save({transaction: tx});

  await createAuthorStatus(tx, author);

  if (didCreate) {
    console.log(`Added author ${author.name} to the DB!`);
  }

  return {author, didCreate};
}

module.exports = async function createAuthors(tx, authorsJSON) {
  if (!Array.isArray(authorsJSON)) {
    // This happens when there is a sole author I think.
    return await createAuthors(tx, [authorsJSON]);
  }

  const authors = [];
  let numCreated = 0;
  for (authorJSON of authorsJSON) {
    const {author, didCreate} = await createAuthor(tx, authorJSON);
    authors.push(author);
    if (didCreate) {
      numCreated += 1;
    }
  }

  return {
    authors,
    numCreated
  }
}
