import { combineReducers } from 'redux';
import authorsReducer from './authors-reducer';
import authorshipsReducer from './authorships-reducer';
import papersReducer from './papers-reducer';

const rootReducer = combineReducers({
  authors: authorsReducer,
  authorships: authorshipsReducer,
  papers: papersReducer,
});

export default rootReducer;
