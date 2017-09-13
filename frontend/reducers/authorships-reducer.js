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
          [authorship.paperLink]: Set([Map(authorship)]),
        },
        byAuthorName: {
          [authorship.authorName]: Set([Map(authorship)]),
        },
      });
    }
  }

  return state;
};

export default authorshipsReducer;
