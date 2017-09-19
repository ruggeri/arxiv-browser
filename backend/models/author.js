const DEFAULT_AUTHORS_LIMIT = 100;

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

    query: async (options) => {
      const {query, limit, isAuthorStarred} = Object.assign({
        limit: DEFAULT_AUTHORS_LIMIT,
      }, options);

      let authorQuery = (
        knex
          .select('authors.*')
          .from('authors')
          .where('authors.name', 'ILIKE', `%${query}%`)
          .orderBy('authors.name')
          .limit(limit)
      );

      if (isAuthorStarred) {
        authorQuery = (
          authorQuery
            .join('authorStatuses', 'authors.id', 'authorStatuses.authorId')
            .where('authorStatuses.isStarred', true)
        );
      }

      return await authorQuery;
    }
  };
}
