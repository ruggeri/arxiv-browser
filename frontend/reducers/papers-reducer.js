import { Map } from 'immutable';
import { RECEIVE_PAPER, RECEIVE_PAPERS } from '../actions/paper-actions';

const papersReducer = (state = Map(), action) => {
  switch (action.type) {
  case RECEIVE_PAPER:
    state = state.update(action.paper.id, Map(action.paper));
  case RECEIVE_PAPERS:
    for (let paper of action.papers) {
      state = state.merge({[paper.link]: Map(paper)});
    }
  }

  return state;
};

export default papersReducer;
