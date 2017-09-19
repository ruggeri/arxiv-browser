module.exports = (knex) => {
  return {
    findAll: async (paperIds) => {
      return await knex
        .select('paperStatuses.*')
        .from('paperStatuses')
        .whereIn(`paperStatuses.paperId`, paperIds)
    }
  };
}
