import { getPersistedComponentState } from 'helpers/component-state-store';
import rootReducer from 'reducers/root-reducer';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

const store = createStore(
  rootReducer,
  {
    componentState: getPersistedComponentState(),
  },
  applyMiddleware(reduxThunk),
);

export const getStore = () => (
  store
);
