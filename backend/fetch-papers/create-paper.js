const models = require('../models');
const createAuthors = require('./create-authors');
const createAuthorships = require('./create-authorships');
const createPaperStatus = require('./create-paper-status');

module.exports = async function createPaper(tx, paperJSON) {
  const paperAttrs = {
    link: paperJSON.link,
    title: paperJSON.title,
    summary: paperJSON.summary,
    updateDateTime: paperJSON["atom:updated"]["#"],
    publicationDateTime: paperJSON["atom:published"]["#"],
  };

  let [paper, didCreatePaper] = [(await (
    tx
      .select('papers.*')
      .from('papers')
      .where({link: paperAttrs.link})
      .first()
  )), false];

  if (!paper) {
    [paper, didCreatePaper] = [(await (
      tx
        .insert({...paperAttrs, createdAt: models.knex.fn.now()})
        .into('papers')
        .returning('*')
    ))[0], true];
  }

  await createPaperStatus(tx, paper);

  const {authors, numCreated: numAuthorsCreated} = await createAuthors(
    tx, paperJSON["atom:author"]
  );
  await createAuthorships(tx, paper, authors);

  return {
    paper,
    didCreatePaper,
    authors,
    numAuthorsCreated,
  };
}
