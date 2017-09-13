export const RECEIVE_AUTHOR_STATUSES = 'RECEIVE_AUTHOR_STATUSES';

export const receiveAuthorStatuses = (authorStatuses) => ({
  type: RECEIVE_AUTHOR_STATUSES,
  authorStatuses: authorStatuses
});
