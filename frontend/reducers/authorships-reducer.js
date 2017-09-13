import { Map, Set } from 'immutable';
import { RECEIVE_AUTHORSHIPS } from '../actions/authorship-actions';

const emptyAuthorshipsState = Map({
  byPaperId: Map(),
  byAuthorId: Map(),
});

const authorshipsReducer = (state = emptyAuthorshipsState, action) => {
  switch (action.type) {
  case RECEIVE_AUTHORSHIPS:
    for (let authorship of action.authorships) {
      state = state.mergeDeep({
        byPaperId: Map([
          [authorship.paperId, Set([Map(authorship)])]
        ]),
        byAuthorId: Map([
          [authorship.authorId, Set([Map(authorship)])]
        ]),
      });
    }
  }

  return state;
};

export default authorshipsReducer;
