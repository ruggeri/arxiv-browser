var crypto = require('crypto');
const models = require('../models');

async function main() {
  try {
    (await (
      models.knex('paperStatuses')
        .update({
          state: 'isAwaitingReview',
          isStarred: false,
        })
    ));

    (await (
      models.knex('authorStatuses')
        .update({isStarred: false})
    ));
  } catch (err) {
    console.log(err);
  } finally {
    models.knex.destroy();
  }
}

main()
