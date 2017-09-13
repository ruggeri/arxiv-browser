import { Map } from 'immutable';
import { RECEIVE_AUTHOR_STATUSES } from '../actions/author-status-actions';

const authorStatusesReducer = (state = Map(), action) => {
  switch (action.type) {
  case RECEIVE_AUTHOR_STATUSES:
    for (let authorStatus of action.authorStatuses) {
      state = state.set(authorStatus.authorId, Map(authorStatus));
    }
  }

  return state;
};

export default authorStatusesReducer;
