import { receiveAuthors } from 'actions/author-actions';
import { receiveAuthorships } from 'actions/authorship-actions';
import { receiveAuthorStatuses } from 'actions/author-status-actions';
import { receivePaperStatuses } from 'actions/paper-status-actions';
import queryString from 'query-string';
import { batchActions } from 'redux-batched-actions';

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
  const qs = queryString.stringify(query);
  const response = await (await fetch(`/api/papers?${qs}`)).json();
  receivePapersResponse(dispatch, response);
}

export const receivePapers = (papers) => ({
  type: RECEIVE_PAPERS,
  papers: papers,
});
