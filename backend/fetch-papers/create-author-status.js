const models = require('../models');

module.exports = async function createAuthorStatus(tx, author) {
  let [authorStatus, didCreate] = [(await (
    tx
      .select('authorStatuses.*')
      .from('authorStatuses')
      .where('authorId', author.id)
      .first()
  )), false];

  if (!authorStatus) {
    [authorStatus, didCreate] = [(await (
      tx
        .insert({
          authorId: author.id,
          isStarred: false,
          createdAt: models.knex.fn.now(),
        })
        .into('authorStatuses')
        .returning('*')
    ))[0], true];
  }

  return {authorStatus, didCreate};
};
