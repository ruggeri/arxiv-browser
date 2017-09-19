module.exports = (knex) => {
  return {
    findAll: async (paperIds) => {
      return await knex
        .select('paperStatuses.*')
        .from('paperStatuses')
        .whereIn(`paperStatuses.paperId`, paperIds)
    },

    toggleArchived: async (id) => {
      return (await (
        knex('paperStatuses')
          .returning('*')
          .where('paperStatuses.paperId', id)
          .update({
            isArchived: knex.raw('NOT "isArchived"')
          })
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
