import { createStore } from 'redux';
import rootReducer from '../reducers/root-reducer.js';

const store = createStore(
  rootReducer,
  {}
);

export const getStore = () => (
  store
);
