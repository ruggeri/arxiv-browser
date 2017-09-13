import { batchActions } from 'redux-batched-actions';

import { receiveAuthors } from './author-actions';
import { receiveAuthorships } from './authorship-actions';
import { receiveAuthorStatuses } from './author-status-actions';
import { receivePaperStatuses } from './paper-status-actions';

export const RECEIVE_PAPERS = 'RECEIVE_PAPERS';

export const fetchAllPapers = () => async (dispatch) => {
  const response = await (await fetch('/api/papers')).json();
  dispatch(batchActions([
    receiveAuthors(response.authors),
    receiveAuthorships(response.authorships),
    receiveAuthorStatuses(response.authorStatuses),
    receivePapers(response.papers),
    receivePaperStatuses(response.paperStatuses),
  ]));
};

export const fetchPaper = (paperId) => async (dispatch) => {
  const response = await (await fetch(`/api/papers/${paperId}`)).json();
  dispatch(batchActions([
    receiveAuthors(response.authors),
    receiveAuthorships(response.authorships),
    receivePapers(response.papers),
  ]));
}

export const receivePapers = (papers) => ({
  type: RECEIVE_PAPERS,
  papers: papers,
});
