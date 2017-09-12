export const RECEIVE_PAPER = 'RECEIVE_PAPER';
export const RECEIVE_PAPERS = 'RECEIVE_PAPERS';

export const fetchPapers = () => async (dispatch) => {
  const fetchedPapers = await (await fetch('/api/papers')).json();
  dispatch(receivePapers(fetchedPapers));
};

export const receivePaper = (paper) => ({
  type: RECEIVE_PAPER,
  paper: paper,
});

export const receivePapers = (papers) => ({
  type: RECEIVE_PAPERS,
  papers: papers,
});
