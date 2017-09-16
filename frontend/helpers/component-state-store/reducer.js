import { CLEAR_COMPONENT_STATE, SAVE_COMPONENT_STATE } from './actions';
import { Map } from 'immutable';

// Maintains a key-value store for saving component state.
export function componentStateReducer(state = Map(), action) {
  switch (action.type) {
  case CLEAR_COMPONENT_STATE:
    state = state.delete(action.keyPath);
  case SAVE_COMPONENT_STATE:
    state = state.set(action.keyPath, action.state);
  }

  return state;
}
