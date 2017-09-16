import { Map } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';

const SAVE_COMPONENT_STATE = 'SAVE_COMPONENT_STATE';

function saveComponentState(keyPath, state) {
  return {
    type: SAVE_COMPONENT_STATE,
    keyPath: keyPath,
    state: state,
  };
}

function componentStateReducer(state = Map(), action) {
  switch (action.type) {
  case SAVE_COMPONENT_STATE:
    state.set(action.keyPath, action.state);
  }

  return state;
}

class ComponentStateProvider extends React.Component {
  getChildContext() {
    return {
      componentStateKeyPath: "/",
      saveComponentState: this.saveComponentState.bind(this),
    };
  }

  saveComponentState(keyPath, state) {
    this.props.saveComponentState(keyPath, state)
  }
}

ComponentStateProvider = connect(
  state => ({
    getStateForKeyPath: keyPath => state.componentState.get(keyPath),
  }),
  dispatch => ({
    saveComponentState: (keyPath, state) => dispatch(saveComponentState(keyPath, state))
  })
)(ComponentStateProvider);

class ComponentStateScope extends React.Component {
  getChildContext() {
    const currentKeyPath = this.context.componentStateKeyPath;
    const childKeyPath = currentKeyPath + "/" + this.props.key;
    return {
      componentStateKeyPath: childKeyPath
    };
  }
}

function connectStatefulComponent(component) {
  function getSavedState() {
    return this.context.getStateForKeyPath(
      component.context.componentStateKeyPath
    );
  }

  const oldComponentWillMount = component.componentWillMount.bind(component);
  component.componentWillMount = function () {
    this.oldSetState(getSavedState());
    oldComponentWillMount();
  };

  const oldSetState = component.setState.bind(component);
  component.setState = function (update, callback) {
    oldSetState(update, () => {
      this.context.saveComponentState(this.state);
      callback();
    });
  };
}

export {
  ComponentStateProvider,
  componentStateReducer,
  ComponentStateScope,
  connectStatefulComponent,
};
