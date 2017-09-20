import I from 'immutable';
import { _authorId, authorsForPaper, isAuthorStarred } from 'queries/author';

const PAPER_STATUS_STATES = [
  'isAwaitingReview',
  'isIgnored',
  'isReviewed',
  'isSavedForLaterReading'
];

export function _paperId(paperOrId) {
  if (!paperOrId) {
    console.log(paperOrId);
    throw "No paper or id given?";
  }

  if (_.isNumber(paperOrId)) {
    return paperOrId;
  } else if (_.isString(paperOrId)) {
    return Number(paperOrId);
  } else {
    return paperOrId.get('id');
  }
}

export const getAllPapers = (state) => {
  return (
    state.papers.valueSeq().toList()
    .sortBy(p => p.get('publicationDateTime')).reverse()
  );
}

export const getPaper = (state, paperOrId) => {
  const paperId = _paperId(paperOrId);
  return state.papers.get(paperId);
}

export const getPaperStatus = (state, paperOrId) => {
  const paperId = _paperId(paperOrId);
  return state.paperStatuses.get(paperId);
}

export const paperHasStarredAuthor = (state, paperOrId) => {
  const authors = authorsForPaper(state, paperOrId);
  return authors.some(author => isAuthorStarred(state, a));
}

export const isPaperIgnored = (state, paperOrId) => {
  const paperStatus = getPaperStatus(state, paperOrId);
  return paperStatus && paperStatus.get('state') == 'isIgnored';
}

export const isReviewed = (state, paperOrId) => {
  const paperStatus = getPaperStatus(state, paperOrId);
  return paperStatus && paperStatus.get('state') == 'isReviewed';
}

export const isPaperSavedForLaterReading = (state, paperOrId) => {
  const paperStatus = getPaperStatus(state, paperOrId);
  return paperStatus && paperStatus.get('state') == 'isSavedForLaterReading';
}

export const isPaperStarred = (state, paperOrId) => {
  const paperStatus = getPaperStatus(state, paperOrId);
  return paperStatus && paperStatus.get('isStarred');
}

export const papersForAuthor = (state, authorOrId) => {
  const authorId = _authorId(authorOrId);

  const authorshipsByAuthorId = state.authorships.get('byAuthorId');
  const authorships = authorshipsByAuthorId.get(authorId, I.Set());
  const papers = authorships.map(
    as => state.papers.get(as.get('paperId'))
  ).filter(p => !!p).sortBy(p => p.get('publicationDateTime')).reverse();

  return papers.toList();
};

export function paperTitleMatchesQuery(state, paperOrId, queryObj) {
  const query = queryObj.query.toLowerCase();
  const paperTitle = getPaper(state, paperOrId).get('title').toLowerCase();
  return query.includes(paperTitle);
}

export function paperAuthorNameMatchesQuery(state, paperOrId, queryObj) {
  const authors = authorsForPaper(state, paperOrId);
  return authors.some(author => (
    author.get('name').toLowerCase().includes(queryObj.query)
  ));
}

export function paperStateMatchesQuery(state, paperOrId, queryObj) {
  const selectedPaperStates = PAPER_STATUS_STATES.filter(
    state => queryObj[state]
  );

  if (selectedPaperStates.length == 0) {
    return true;
  }

  const paperStatus = getPaperStatus(state, paperOrId);
  return selectedPaperStates.includes(paperStatus.get('state'));
}

// TODO: support filters on the queryObj.
export function searchPapers(state, queryObj, papers, {limitResults} = {}) {
  let matchedResults = state.papers.toList().filter(paper => {
    if (paperTitleMatchesQuery(state, paper, queryObj)) {
      return true;
    } else if (paperAuthorNameMatchesQuery(state, paper, queryObj)) {
      return true;
    } else {
      return false;
    }
  });

  if (queryObj.requirePaperStarred) {
    matchedResults = matchedResults.filter(paper => {
      return isPaperStarred(state, paper);
    });
  }

  if (queryObj.requireAuthorStarred) {
    matchedResults = matchedResults.filter(paper => {
      return paperHasStarredAuthor(state, paper);
    });
  }

  matchedResults = matchedResults.filter(paper => {
    return paperStateMatchesQuery(state, paper, queryObj);
  });

  matchedResults = matchedResults.sortBy(
    paper => paper.get('publicationDateTime')
  ).reverse();

  if (limitResults) {
    matchedItems = matchedItems.take(limitResults);
  }

  return matchedResults.toList();
}
