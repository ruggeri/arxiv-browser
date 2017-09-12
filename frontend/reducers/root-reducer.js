import { combineReducers } from 'redux';
import papersReducer from './papers-reducer';

const rootReducer = combineReducers({
  papers: papersReducer
});

export default rootReducer;
