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
        .insert(authorAttrs)
        .into('authors')
        .returning('authors.*')
        .first()
    )), true];
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
  for (let authorJSON of authorsJSON) {
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
