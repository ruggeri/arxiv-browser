import { combineReducers } from 'redux';
import { enableBatching } from 'redux-batched-actions';

import authorsReducer from './authors-reducer';
import authorshipsReducer from './authorships-reducer';
import authorStatusesReducer from './author-statuses-reducer';
import papersReducer from './papers-reducer';
import paperStatusesReducer from './paper-statuses-reducer';

const rootReducer = enableBatching(combineReducers({
  authors: authorsReducer,
  authorships: authorshipsReducer,
  authorStatuses: authorStatusesReducer,
  papers: papersReducer,
  paperStatuses: paperStatusesReducer,
}));

export default rootReducer;
