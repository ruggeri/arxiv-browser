import { receiveAuthors } from './author-actions';
import { receiveAuthorships } from './authorship-actions';

export const RECEIVE_PAPER = 'RECEIVE_PAPER';
export const RECEIVE_PAPERS = 'RECEIVE_PAPERS';

export const fetchPapers = () => async (dispatch) => {
  const response = await (await fetch('/api/papers')).json();
  dispatch(receivePapers(response.papers));
  dispatch(receiveAuthorships(response.authorships));
  dispatch(receiveAuthors(response.authors));
};

export const receivePaper = (paper) => ({
  type: RECEIVE_PAPER,
  paper: paper,
});

export const receivePapers = (papers) => ({
  type: RECEIVE_PAPERS,
  papers: papers,
});
