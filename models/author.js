module.exports = (knex) => {
  return {
    findAll: async ({limit}) => {
      return await knex
        .select('authors.*')
        .from('authors')
        .limit(limit)
    },

    findByIds: async (authorIds) => {
      return await knex
        .select('authors.*')
        .from('authors')
        .whereIn('authors.id', authorIds)
    },
  };
}
