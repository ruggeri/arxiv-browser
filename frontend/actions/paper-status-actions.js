export const RECEIVE_PAPER_STATUSES = 'RECEIVE_PAPER_STATUSES';

export const receivePaperStatuses = (paperStatuses) => ({
  type: RECEIVE_PAPER_STATUSES,
  paperStatuses: paperStatuses
});
