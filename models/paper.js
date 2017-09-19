const _ = require('lodash');

DEFAULT_PAPERS_LIMIT = 100;

function chainIsPaperStarred(paperQuery) {
  return (
    paperQuery
      .join('paperStatuses', 'papers.id', 'paperStatuses.paperId')
      .where('paperStatuses.isStarred', true)
  );
}

function chainIsAuthorStarred(paperQuery) {
  return (
    paperQuery
      .join('authorships', 'papers.id', 'authorships.paperId')
      .join('authorStatuses', 'authorships.authorId', 'authorStatuses.authorId')
      .where('authorStatuses.isStarred', true)
  );
}

module.exports = (knex) => {
  const Paper = {
    query: async (options) => {
      const {query, limit, isPaperStarred, isAuthorStarred} = Object.assign({
        limit: DEFAULT_PAPERS_LIMIT,
      }, options);

      const resultsByTitle = await Paper.queryByTitle(options);
      if (!query) {
        return resultsByTitle;
      }

      const resultsByAuthorName = await Paper.queryByAuthorName(options);
      const mergedResults = (
        _(resultsByTitle)
        .unionBy(resultsByAuthorName, 'id')
        .orderBy(['publicationDateTime', 'DESC'])
        .take(limit)
        .value()
      )

      return mergedResults;
    },

    queryByAuthorName: async (options) => {
      const {query, limit, isPaperStarred, isAuthorStarred} = Object.assign({
        limit: DEFAULT_PAPERS_LIMIT,
      }, options);

      let paperQuery = (
        knex
          .select('papers.*')
          .from('papers')
          .orderBy('publicationDateTime', 'DESC')
          .limit(limit)
          .join('authorships', 'papers.id', 'authorships.paperId')
          .join('authors', 'authorships.authorId', 'authors.id')
          .where('authors.name', 'ILIKE', `%${query}%`)
          .groupBy('papers.id')
      );

      if (isPaperStarred) {
        paperQuery = chainIsPaperStarred(paperQuery);
      }
      if (isAuthorStarred) {
        paperQuery = paperQuery
          .join('authorStatuses', 'authors.id', 'authorStatuses.authorId')
          .where('authorStatuses.isStarred', true);
      }

      return await paperQuery;
    },

    queryByTitle: async (options) => {
      const {query, limit, isPaperStarred, isAuthorStarred} = Object.assign({
        limit: DEFAULT_PAPERS_LIMIT,
      }, options);

      let paperQuery = (
        knex
          .select('papers.*')
          .from('papers')
          .orderBy('publicationDateTime', 'DESC')
          .where('papers.title', 'ILIKE', `%${query}%`)
          .limit(limit)
          .groupBy('papers.id')
      );

      if (isPaperStarred) {
        paperQuery = chainIsPaperStarred(paperQuery);
      }
      if (isAuthorStarred) {
        paperQuery = chainIsAuthorStarred(paperQuery);
      }

      return await paperQuery;
    },

    toggleArchived: async (id) => {
      return await (
        knex('papersStatuses')
        .select('papersStatuses.*')
        .where('papersStatuses.paperId', id)
        .update({
          'papersStatuses.isArchived': knex.raw('NOT papersStatuses.isArchived')
        })
      );
    },

    toggleIsStarred: async (id) => {
      return await (
        knex('papersStatuses')
        .select('papersStatuses.*')
        .where('papersStatuses.paperId', id)
        .update({
          'papersStatuses.isStarred': knex.raw('NOT papersStatuses.isStarred')
        })
      );
    },

  }

  return Paper;
};
