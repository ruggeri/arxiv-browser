import { CLEAR_COMPONENT_STATE, SAVE_COMPONENT_STATE } from './actions';
import { List, Map } from 'immutable';
import transit from 'transit-immutable-js';

const LOCAL_STORAGE_PREFIX = '/componentState';

function localStorageKeys() {
  let keys = List();
  for (let i = 0; i < localStorage.length; ++i) {
    const key = localStorage.key(i);
    if (key.startsWith(LOCAL_STORAGE_PREFIX)) {
      keys = keys.push(key);
    }
  }

  return keys;
}

export function getPersistedComponentState() {
  let state = Map();
  localStorageKeys().forEach(localStorageKey => {
    const value = transit.fromJSON(localStorage.getItem(localStorageKey));
    const stateKey = localStorageKey.slice(LOCAL_STORAGE_PREFIX.length);
    state = state.set(stateKey, value);
  });

  return state;
}

// Maintains a key-value store for saving component state.
export function componentStateReducer(state = Map(), action) {
  switch (action.type) {
  case CLEAR_COMPONENT_STATE:
    state = state.delete(action.keyPath);
    localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}${action.keyPath}`);
  case SAVE_COMPONENT_STATE:
    state = state.set(action.keyPath, action.state);
    localStorage.setItem(
      `${LOCAL_STORAGE_PREFIX}${action.keyPath}`,
      transit.toJSON(action.state)
    );
  }

  return state;
}
