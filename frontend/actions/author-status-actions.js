export const RECEIVE_AUTHOR_STATUSES = 'RECEIVE_AUTHOR_STATUSES';

export const toggleAuthorStar = (authorId) => async (dispatch) => {
  const request = new Request(
    `/api/authors/${authorId}/authorStatus/toggleStar`, {
    method: "POST",
  });

  const response = await (await fetch(request)).json();
  dispatch(receiveAuthorStatuses([response.authorStatus]));
};

export const receiveAuthorStatuses = (authorStatuses) => ({
  type: RECEIVE_AUTHOR_STATUSES,
  authorStatuses: authorStatuses
});
