export const RECEIVE_AUTHORSHIPS = 'RECEIVE_AUTHORSHIPS';

export const receiveAuthorships = (authorships) => ({
  type: RECEIVE_AUTHORSHIPS,
  authorships: authorships
});
