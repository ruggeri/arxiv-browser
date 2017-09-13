import { Map } from 'immutable';
import { RECEIVE_PAPER_STATUSES } from '../actions/paper-status-actions';

const paperStatusesReducer = (state = Map(), action) => {
  switch (action.type) {
  case RECEIVE_PAPER_STATUSES:
    for (let paperStatus of action.paperStatuses) {
      state = state.merge(
        Map([[paperStatus.paperId, Map(paperStatus)]])
      );
    }
  }

  return state;
};

export default paperStatusesReducer;
