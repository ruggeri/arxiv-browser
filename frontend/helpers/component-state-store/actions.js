export const CLEAR_COMPONENT_STATE = 'CLEAR_COMPONENT_STATE';
export const SAVE_COMPONENT_STATE = 'SAVE_COMPONENT_STATE';

export function clearComponentState(keyPath) {
  return {
    type: CLEAR_COMPONENT_STATE,
    keyPath: keyPath,
  };
}

export function saveComponentState(keyPath, state) {
  return {
    type: SAVE_COMPONENT_STATE,
    keyPath: keyPath,
    state: state,
  };
}
