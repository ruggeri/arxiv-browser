import { createStore, applyMiddleware } from 'redux';
import reduxMulti from 'redux-multi';
import reduxThunk from 'redux-thunk';
import rootReducer from '../reducers/root-reducer.js';

const store = createStore(
  rootReducer,
  {},
  applyMiddleware(reduxMulti, reduxThunk),
);

export const getStore = () => (
  store
);
