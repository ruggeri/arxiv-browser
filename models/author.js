module.exports = (knex) => {
  return {
    findAll: async (authorIds) => {
      return await knex
        .select('authors.*')
        .from('authors')
        .whereIn(`authors.id`, authorIds)
    }
  };
}
