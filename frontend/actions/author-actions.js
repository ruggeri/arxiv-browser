import { batchActions } from 'redux-batched-actions';

import { receiveAuthorships } from './authorship-actions';
import { receiveAuthorStatuses } from './author-status-actions';
import { receivePapers } from './paper-actions';
import { receivePaperStatuses } from './paper-status-actions';

export const RECEIVE_AUTHORS = 'RECEIVE_AUTHORS';

export const fetchAuthor = (authorId) => async (dispatch) => {
  const response = await (await fetch(`/api/authors/${authorId}`)).json();
  dispatch(batchActions([
    receiveAuthors(response.authors),
    receiveAuthorships(response.authorships),
    receiveAuthorStatuses(response.authorStatuses),
    receivePapers(response.papers),
    receivePaperStatuses(response.paperStatuses),
  ]));
};

export const receiveAuthors = (authors) => ({
  type: RECEIVE_AUTHORS,
  authors: authors,
});
