import { Map } from 'immutable';
import PropTypes from 'prop-types';
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

// TODO: Needs to hook in with the history from react-router to store
// under the appropriate keyPath. The history.key needs to be part of
// the keyPath.
class ComponentStateProvider extends React.Component {
  getChildContext() {
    return {
      componentStateKeyPath: "/",
      saveComponentState: this.saveComponentState.bind(this),
    };
  }

  render() {
    return (
      <div>{this.props.children}</div>
    )
  }

  saveComponentState(keyPath, state) {
    this.props.saveComponentState(keyPath, state)
  }
}

ComponentStateProvider.childContextTypes = {
  componentStateKeyPath: PropTypes.string,
  saveComponentState: PropTypes.func,
};

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

// TODO: Unclear how to handle initial state if nothing is stored at present.
// TODO: should attempt to clear the stateStore on unmounting.
class StatefulComponent extends React.Component {
  componentWillMount() {
    this.setState({
      childState: this.context.getStateForKeyPath(
        this.context.componentStateKeyPath + "/" + this.key
      ),
    });
  }

  setChildState(newState) {
    this.setState({
      childState: {
        ...this.state.childState,
        ...newState
      }
    }, () => {
      this.context.saveComponentState(this.state.childState);
    });
  }

  render() {
    const child = this.children[0];
    const extendedChild = React.cloneElement(
      child,
      {
        setState: this.setChildState.bind(this),
        state: this.state.childState,
      }
    );

    return extendedChild;
  }
}

StatefulComponent.propTypes = {
  children: PropTypes.element.isRequired,
};

export {
  ComponentStateProvider,
  componentStateReducer,
  ComponentStateScope,
  connectStatefulComponent,
};
