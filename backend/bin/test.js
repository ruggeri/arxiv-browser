var crypto = require('crypto');
const models = require('../models');

async function main() {
  try {
    const link = crypto.randomBytes(20).toString('hex');
    const paper = (await (
      models.knex
        .insert({
          title: "bogus",
          link: link,
          summary: "bogus",
          publicationDateTime: models.knex.fn.now(),
          updateDateTime: models.knex.fn.now(),
          createdAt: models.knex.fn.now(),
        })
        .into('papers')
        .returning('*')
    ))[0];
    console.log(paper)

    const paperStatus = (await (
      models.knex
        .insert({
          paperId: paper.id,
          isArchived: false,
          isStarred: false,
          createdAt: models.knex.fn.now(),
        })
        .into('paperStatuses')
        .returning('*')
    ))[0];

    console.log(paperStatus);
  } catch (err) {
    console.log(err);
  } finally {
    models.knex.destroy();
  }
}

main()
