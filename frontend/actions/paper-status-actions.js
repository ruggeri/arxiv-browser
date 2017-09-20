import $ from 'jquery';

export const RECEIVE_PAPER_STATUSES = 'RECEIVE_PAPER_STATUSES';

export const togglePaperStar = (paperId) => async (dispatch) => {
  const request = new Request(
    `/api/papers/${paperId}/paperStatus/toggleStar`, {
    method: "POST",
  });

  const response = await (await fetch(request)).json();
  dispatch(receivePaperStatuses([response.paperStatus]));
};


export const toggleIsSavedForLaterReading = (paperId) => async (dispatch) => {
  const response = await $.ajax({
    url: `/api/papers/${paperId}/paperStatus/toggleState?state=isSavedForLaterReading`,
    method: 'POST',
  });

  dispatch(receivePaperStatuses([response.paperStatus]));
};

export const toggleIsIgnored = (paperId) => async (dispatch) => {
  const response = await $.ajax({
    url: `/api/papers/${paperId}/paperStatus/toggleState?state=isIgnored`,
    method: 'POST',
  });

  dispatch(receivePaperStatuses([response.paperStatus]));
};

export const toggleIsReviewed = (paperId) => async (dispatch) => {
  const response = await $.ajax({
    url: `/api/papers/${paperId}/paperStatus/toggleState?state=isReviewed`,
    method: 'POST',
  });

  dispatch(receivePaperStatuses([response.paperStatus]));
};


export const receivePaperStatuses = (paperStatuses) => ({
  type: RECEIVE_PAPER_STATUSES,
  paperStatuses: paperStatuses,
});
