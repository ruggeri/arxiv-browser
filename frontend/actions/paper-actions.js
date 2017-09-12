export const RECEIVE_PAPER = 'RECEIVE_PAPER';
export const RECEIVE_PAPERS = 'RECEIVE_PAPERS';

export const receivePaper = (paper) => ({
  type: RECEIVE_PAPER,
  paper: paper,
});

export const receivePapers = (papers) => ({
  type: RECEIVE_PAPERS,
  papers: papers
});
