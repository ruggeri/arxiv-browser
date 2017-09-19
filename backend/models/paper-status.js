module.exports = (knex) => {
  return {
    findByIds: async (paperIds) => {
      return await knex
        .select('paperStatuses.*')
        .from('paperStatuses')
        .whereIn(`paperStatuses.paperId`, paperIds)
    },

    setState: async (id, state) => {
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
