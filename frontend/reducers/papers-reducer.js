import { Map } from 'immutable-js';
import { RECEIVE_PAPER, RECEIVE_PAPERS } from '../actions/paper-actions.js';

const papersReducer = (state = new Map({}), action) => {
  switch (action.type) {
  case RECEIVE_PAPER:
    return state.update(action.paper.id, action.paper);
  case RECEIVE_PAPERS:
    return state.merge(action.papers);
  default:
    return state;
  }
};

export default papersReducer;
