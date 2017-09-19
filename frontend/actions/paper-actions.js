import { batchActions } from 'redux-batched-actions';

import { receiveAuthors } from './author-actions';
import { receiveAuthorships } from './authorship-actions';
import { receiveAuthorStatuses } from './author-status-actions';
import { receivePaperStatuses } from './paper-status-actions';

export const RECEIVE_PAPERS = 'RECEIVE_PAPERS';

const receivePapersResponse = (dispatch, response) => {
  dispatch(batchActions([
    receiveAuthors(response.authors),
    receiveAuthorships(response.authorships),
    receiveAuthorStatuses(response.authorStatuses),
    receivePapers(response.papers),
    receivePaperStatuses(response.paperStatuses),
  ]));
}

export const fetchLatestPapers = () => async (dispatch) => {
  const response = await (await fetch('/api/papers')).json();
  receivePapersResponse(dispatch, response);
};

export const fetchPaper = (paperId) => async (dispatch) => {
  const response = await (await fetch(`/api/papers/${paperId}`)).json();
  receivePapersResponse(dispatch, response);
}

export const fetchPaperQueryResults = (query) => async (dispatch) => {
  console.log("I fetch for you!")
  query = encodeURIComponent(query);
  const response = await (await fetch(`/api/papers?query=${query}`)).json();
  receivePapersResponse(dispatch, response);
}

export const receivePapers = (papers) => ({
  type: RECEIVE_PAPERS,
  papers: papers,
});
