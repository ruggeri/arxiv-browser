const _ = require('lodash');

const STATE_ENUM_VALUES = [
  'isAwaitingReview',
  'isIgnored',
  'isSavedForLaterReading',
  'isRead',
];

module.exports = (knex) => {
  return {
    findByIds: async (paperIds) => {
      return await knex
        .select('paperStatuses.*')
        .from('paperStatuses')
        .whereIn(`paperStatuses.paperId`, paperIds)
    },

    setState: async (id, state) => {
      if (!_.includes(STATE_ENUM_VALUES, state)) {
        throw "Unknown state value!";
      }

      return (await (
        knex('paperStatuses')
          .returning('*')
          .where('paperStatuses.paperId', id)
          .update({state: state})
      ))[0];
    },

    toggleStarred: async (id) => {
      return (await (
        knex('paperStatuses')
          .returning('*')
          .where('paperStatuses.paperId', id)
          .update({
            isStarred: knex.raw('NOT "isStarred"')
          })
      ))[0];
    },
  };
}
