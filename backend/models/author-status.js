module.exports = (knex) => {
  return {
    findByIds: async (authorIds) => {
      return await knex
        .select('authorStatuses.*')
        .from('authorStatuses')
        .whereIn(`authorStatuses.authorId`, authorIds)
    },

    toggleStarred: async (id) => {
      return (await (
        knex('authorStatuses')
          .returning('*')
          .where('authorStatuses.authorId', id)
          .update({
            isStarred: knex.raw('NOT "isStarred"')
          })
      ))[0];
    },
  };
}
