import { receiveAuthors } from './author-actions';
import { receiveAuthorships } from './authorship-actions';

export const RECEIVE_PAPER = 'RECEIVE_PAPER';
export const RECEIVE_PAPERS = 'RECEIVE_PAPERS';

export const fetchPapers = () => async (dispatch) => {
  const response = await (await fetch('/api/papers')).json();
  dispatch([
    receiveAuthors(response.authors),
    receiveAuthorships(response.authorships),
    receivePapers(response.papers),
  ]);
};

export const receivePaper = (paper) => ({
  type: RECEIVE_PAPER,
  paper: paper,
});

export const receivePapers = (papers) => ({
  type: RECEIVE_PAPERS,
  papers: papers,
});
