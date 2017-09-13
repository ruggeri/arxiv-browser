import { receiveAuthorships } from './authorship-actions';
import { receivePapers } from './paper-actions';

export const RECEIVE_AUTHOR = 'RECEIVE_AUTHOR';
export const RECEIVE_AUTHORS = 'RECEIVE_AUTHORS';

export const fetchAuthor = (authorId) => async (dispatch) => {
  const response = await (await fetch(`/api/authors/${authorId}`)).json();
  dispatch([
    receiveAuthors(response.authors),
    receiveAuthorships(response.authorships),
    receivePapers(response.papers),
  ]);
};

export const receiveAuthor = (author) => ({
  type: RECEIVE_AUTHOR,
  author: author,
});

export const receiveAuthors = (authors) => ({
  type: RECEIVE_AUTHORS,
  authors: authors,
});
