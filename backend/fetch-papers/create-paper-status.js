const models = require('../models');

module.exports = async function createPaperStatus(tx, paper) {
  let [paperStatus, didCreate] = [(await (
    tx
      .select('paperStatuses.*')
      .from('paperStatuses')
      .where('paperId', paper.id)
      .first()
  )), false];

  if (!paperStatus) {
    [paperStatus, didCreate] = [(await (
      tx
        .insert({
          paperId: paper.id,
          isArchived: false,
          isStarred: false,
          createdAt: models.knex.fn.now(),
        })
        .into('paperStatuses')
        .returning('*')
    ))[0], true];
  }

  return {paperStatus, didCreate};
};
