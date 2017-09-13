import { Map, Set } from 'immutable';
import { RECEIVE_AUTHORSHIPS } from '../actions/authorship-actions';

const emptyAuthorshipsState = Map({
  byPaperLink: Map(),
  byAuthorName: Map(),
});

const authorshipsReducer = (state = emptyAuthorshipsState, action) => {
  switch (action.type) {
  case RECEIVE_AUTHORSHIPS:
    for (let authorship of action.authorships) {
      state = state.mergeDeep({
        byPaperLink: {
          [authorship.paperLink]: Set([authorship]),
        },
        byAuthorName: {
          [authorship.authorName]: Set([authorship]),
        },
      });
    }
  }

  return state;
};

export default authorshipsReducer;
