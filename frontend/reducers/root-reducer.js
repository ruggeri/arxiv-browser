import { combineReducers } from 'redux';
import { enableBatching } from 'redux-batched-actions';

import { componentStateReducer } from 'helpers/component-state-store';
import authorsReducer from 'reducers/authors-reducer';
import authorshipsReducer from 'reducers/authorships-reducer';
import authorStatusesReducer from 'reducers/author-statuses-reducer';
import papersReducer from 'reducers/papers-reducer';
import paperStatusesReducer from 'reducers/paper-statuses-reducer';

const rootReducer = enableBatching(combineReducers({
  authors: authorsReducer,
  authorships: authorshipsReducer,
  authorStatuses: authorStatusesReducer,
  componentState: componentStateReducer,
  papers: papersReducer,
  paperStatuses: paperStatusesReducer,
}));

export default rootReducer;
