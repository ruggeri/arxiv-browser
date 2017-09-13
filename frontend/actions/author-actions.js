export const RECEIVE_AUTHOR = 'RECEIVE_AUTHOR';
export const RECEIVE_AUTHORS = 'RECEIVE_AUTHORS';

export const receiveAuthor = (author) => ({
  type: RECEIVE_AUTHOR,
  author: author,
});

export const receiveAuthors = (authors) => ({
  type: RECEIVE_AUTHORS,
  authors: authors,
});
