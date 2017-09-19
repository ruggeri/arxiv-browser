import { receiveAuthorships } from 'actions/authorship-actions';
import { receiveAuthorStatuses } from 'actions/author-status-actions';
import { receivePapers } from 'actions/paper-actions';
import { receivePaperStatuses } from 'actions/paper-status-actions';
import queryString from 'query-string';
import { batchActions } from 'redux-batched-actions';

export const RECEIVE_AUTHORS = 'RECEIVE_AUTHORS';

function receiveResponse(dispatch, response) {
  dispatch(batchActions([
    receiveAuthors(response.authors),
    receiveAuthorships(response.authorships),
    receiveAuthorStatuses(response.authorStatuses),
    receivePapers(response.papers),
    receivePaperStatuses(response.paperStatuses),
  ]));
}

export const fetchAuthor = (authorId) => async (dispatch) => {
  const response = await (await fetch(`/api/authors/${authorId}`)).json();
  receiveResponse(dispatch, response);
};

export const fetchAllAuthors = () => async (dispatch) => {
  const response = await (await fetch('/api/authors')).json();
  receiveResponse(dispatch, response);
};

export const fetchAuthorQueryResults = (query) => async (dispatch) => {
  const qs = queryString.stringify(query);
  const response = await (await fetch(`/api/authors?${qs}`)).json();
  receiveResponse(dispatch, response);
}

export const receiveAuthors = (authors) => ({
  type: RECEIVE_AUTHORS,
  authors: authors,
});
