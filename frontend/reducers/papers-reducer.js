import { Map } from 'immutable';
import { RECEIVE_PAPERS } from '../actions/paper-actions';

const papersReducer = (state = Map(), action) => {
  switch (action.type) {
  case RECEIVE_PAPERS:
    for (let paper of action.papers) {
      state = state.set(paper.id, Map(paper));
    }
  }

  return state;
};

export default papersReducer;
