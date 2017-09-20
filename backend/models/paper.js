const _ = require('lodash');

const DEFAULT_PAPERS_LIMIT = 100;
const PAPER_STATUS_STATES = [
  'isAwaitingReview',
  'isIgnored',
  'isReviewed',
  'isSavedForLaterReading'
];

function addPaperStatusStateFilters(paperQuery, queryObj) {
  const selectedStates = _.filter(
    PAPER_STATUS_STATES,
    state => queryObj[state] === "true"
  );

  if (selectedStates.length === 0) {
    return paperQuery;
  }

  return paperQuery.whereIn('paperStatuses.state', selectedStates);
}

module.exports = (knex) => {
  const Paper = {
    findByIds: async (paperIds) => {
      return await (
        knex
          .select('papers.*')
          .from('papers')
          .orderBy('publicationDateTime', 'DESC')
          .whereIn('id', paperIds)
      )
    },

    findForAuthorIds: async (authorIds) => {
      return await (
        knex
          .select('papers.*')
          .from('papers')
          .join('authorships', 'papers.id', 'authorships.paperId')
          .join('authors', 'authorships.authorId', 'authors.id')
          .whereIn('authors.id', authorIds)
      );
    },

    query: async (queryObj) => {
      const {limit, query} = Object.assign({
        limit: DEFAULT_PAPERS_LIMIT,
      }, queryObj);

      const resultsByTitle = await Paper.queryByTitle(queryObj);
      if (!query) {
        return resultsByTitle;
      }

      const resultsByAuthorName = await Paper.queryByAuthorName(queryObj);
      const mergedResults = (
        _(resultsByTitle)
        .unionBy(resultsByAuthorName, 'id')
        .orderBy('publicationDateTime', 'desc')
        .take(limit)
        .value()
      )

      return mergedResults;
    },

    queryByAuthorName: async (queryObj) => {
      const {query, limit, isPaperStarred, isAuthorStarred} = Object.assign({
        limit: DEFAULT_PAPERS_LIMIT,
      }, queryObj);

      let paperQuery = (
        knex
          .select('papers.*')
          .from('papers')
          .orderBy('publicationDateTime', 'DESC')
          .join('paperStatuses', 'papers.id', 'paperStatuses.paperId')
          .join('authorships', 'papers.id', 'authorships.paperId')
          .join('authors', 'authorships.authorId', 'authors.id')
          .where('authors.name', 'ILIKE', `%${query}%`)
          .groupBy('papers.id')
          .limit(limit)
      );

      if (isPaperStarred) {
        paperQuery = paperQuery.where('paperStatuses.isStarred', true)
      }
      paperQuery = addPaperStatusStateFilters(paperQuery, queryObj);

      if (isAuthorStarred) {
        paperQuery = paperQuery
          .join('authorStatuses', 'authors.id', 'authorStatuses.authorId')
          .where('authorStatuses.isStarred', true);
      }

      return await paperQuery;
    },

    queryByTitle: async (queryObj) => {
      const {query, limit, isPaperStarred, isAuthorStarred} = Object.assign({
        limit: DEFAULT_PAPERS_LIMIT,
      }, queryObj);

      let paperQuery = (
        knex
          .select('papers.*')
          .from('papers')
          .where('papers.title', 'ILIKE', `%${query}%`)
          .join('paperStatuses', 'papers.id', 'paperStatuses.paperId')
          .groupBy('papers.id')
          .orderBy('publicationDateTime', 'DESC')
          .limit(limit)
      );

      if (isPaperStarred) {
        paperQuery = paperQuery.where('paperStatuses.isStarred', true)
      }

      paperQuery = addPaperStatusStateFilters(paperQuery, queryObj);

      if (isAuthorStarred) {
        paperQuery = (
          paperQuery
            .join('authorships', 'papers.id', 'authorships.paperId')
            .join('authorStatuses', 'authorships.authorId', 'authorStatuses.authorId')
            .where('authorStatuses.isStarred', true)
        );
      }

      return await paperQuery;
    },
  }

  return Paper;
};
