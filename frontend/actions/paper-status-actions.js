export const RECEIVE_PAPER_STATUSES = 'RECEIVE_PAPER_STATUSES';

export const togglePaperStar = (paperStatus) => async (dispatch) => {
  const response = await (await fetch({
    url: `/api/papers/${paperStatus.paperId}/paperStatus/toggleStar`,
    method: "POST",
  })).json();
  dispatch(receivePaperStatuses([response.paperStatus]));
};

export const receivePaperStatuses = (paperStatuses) => ({
  type: RECEIVE_PAPER_STATUSES,
  paperStatuses: paperStatuses
});
