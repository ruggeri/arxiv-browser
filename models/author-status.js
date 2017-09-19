module.exports = (knex) => {
  return {
    findAll: async (authorIds) => {
      return await knex
        .select('authorStatuses.*')
        .from('authorStatuses')
        .whereIn(`authorStatuses.authorId`, authorIds)
    }
  };
}
