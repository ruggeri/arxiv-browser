import { Map } from 'immutable';
import { RECEIVE_AUTHORS } from '../actions/author-actions';

const authorsReducer = (state = Map(), action) => {
  switch (action.type) {
  case RECEIVE_AUTHORS:
    for (let author of action.authors) {
      state = state.set(author.id, Map(author));
    }
  }

  return state;
};

export default authorsReducer;
