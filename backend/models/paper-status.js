const _ = require('lodash');

const STATE_ENUM_VALUES = [
  'isAwaitingReview',
  'isIgnored',
  'isSavedForLaterReading',
  'isReviewed',
];

module.exports = (knex) => {
  const PaperStatus = {
    findByIds: async (paperIds) => {
      return await knex
        .select('paperStatuses.*')
        .from('paperStatuses')
        .whereIn(`paperStatuses.paperId`, paperIds)
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

    toggleState: async (id, state) => {
      if (!_.includes(STATE_ENUM_VALUES, state)) {
        throw "Unknown state value!";
      }

      const paperStatus = (await PaperStatus.findByIds([id]))[0];

      let stateToSet;
      if (paperStatus.state === state) {
        stateToSet = 'isAwaitingReview';
      } else {
        stateToSet = state;
      }

      return (await (
        knex('paperStatuses')
          .returning('*')
          .where('paperStatuses.paperId', id)
          .update({state: stateToSet})
      ))[0];
    },
  };

  return PaperStatus;
}
