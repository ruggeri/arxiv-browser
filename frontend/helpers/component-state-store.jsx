import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import * as ReactRedux from 'react-redux';

const CLEAR_COMPONENT_STATE = 'CLEAR_COMPONENT_STATE';
const SAVE_COMPONENT_STATE = 'SAVE_COMPONENT_STATE';

function clearComponentState(keyPath) {
  return {
    type: CLEAR_COMPONENT_STATE,
    keyPath: keyPath,
  };
}

function saveComponentState(keyPath, state) {
  return {
    type: SAVE_COMPONENT_STATE,
    keyPath: keyPath,
    state: state,
  };
}

function componentStateReducer(state = Map(), action) {
  switch (action.type) {
  case CLEAR_COMPONENT_STATE:
    state = state.delete(action.keyPath);
  case SAVE_COMPONENT_STATE:
    state = state.set(action.keyPath, action.state);
  }

  return state;
}

// TODO: Needs to hook in with the history from react-router to store
// under the appropriate keyPath. The history.key needs to be part of
// the keyPath.
class ComponentStateProvider extends React.Component {
  constructor(props) {
    super(props);
  }

  getChildContext() {
    const historyKey = this.context.router.history.location.key
    return {
      clearComponentState: this.clearComponentState.bind(this),
      componentStateKeyPath: `/${historyKey}`,
      getComponentState: this.getComponentState.bind(this),
      saveComponentState: this.saveComponentState.bind(this),
    };
  }

  render() {
    return (
      <div>{this.props.children}</div>
    )
  }

  clearComponentState(keyPath) {
    this.context.store.dispatch(clearComponentState(keyPath));
  }

  getComponentState(keyPath) {
    return this.context.store.getState().componentState.get(keyPath);
  }

  saveComponentState(keyPath, state) {
    this.context.store.dispatch(saveComponentState(keyPath, state));
  }
}

ComponentStateProvider.childContextTypes = {
  clearComponentState: PropTypes.func.isRequired,
  componentStateKeyPath: PropTypes.string.isRequired,
  getComponentState: PropTypes.func.isRequired,
  saveComponentState: PropTypes.func.isRequired,
};

ComponentStateProvider.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
}

class ComponentStateScope extends React.Component {
  getChildContext() {
    const currentKeyPath = this.context.componentStateKeyPath;
    const childKeyPath = `${currentKeyPath}/${this.props.kkey}`;
    return {
      componentStateKeyPath: childKeyPath
    };
  }
}

ComponentStateScope.propTypes = {
  kkey: PropTypes.string.isRequired,
};
ComponentStateScope.contextTypes = {
  componentStateKeyPath: PropTypes.string.isRequired
};
ComponentStateScope.childContextTypes = {
  componentStateKeyPath: PropTypes.string.isRequired,
};

class StatefulComponent extends React.Component {
  constructor(props) {
    super(props);

    this.clearPersistedChildState = () => {
      this.context.clearComponentState(this.keyPath());
    };
    this.getPersistedChildState = () => {
      return this.context.getComponentState(this.keyPath());
    };
    this.persistChildState = (newState) => {
      this.context.saveComponentState(this.keyPath(), newState);
    };
  }

  keyPath() {
    return `${this.context.componentStateKeyPath}/${this.props.kkey}`;
  }

  render() {
    const child = this.props.children;
    const extendedChild = React.cloneElement(
      child,
      {
        clearPersistedState: this.clearPersistedChildState,
        getPersistedState: this.getPersistedChildState,
        persistState: this.persistChildState,
      }
    );

    return extendedChild;
  }
}

StatefulComponent.propTypes = {
  children: PropTypes.element.isRequired,
  kkey: PropTypes.string.isRequired,
};

StatefulComponent.contextTypes = {
  clearComponentState: PropTypes.func.isRequired,
  componentStateKeyPath: PropTypes.string.isRequired,
  getComponentState: PropTypes.func.isRequired,
  saveComponentState: PropTypes.func.isRequired,
};

function connect(component) {
  class ExtendedComponent extends component {
    componentWillMount() {
      const persistedState = this.props.getPersistedState();
      if (persistedState) {
        super.setState(persistedState);
      }
    }

    setState(newState, callback) {
      super.setState(newState, () => {
        this.props.persistState(this.state);
        if (callback) {
          callback();
        }
      });
    }

    componentWillUnmount() {
      // TODO: Won't work yet; we need a way to know whether we're
      // unmounting because of a navigation.
      // this.props.clearPersistedState();
    }
  }

  class WrapperComponent extends React.Component {
    render() {
      return (
        <StatefulComponent kkey={this.props.kkey}>
          <ExtendedComponent {...this.props}/>
        </StatefulComponent>
      )
    }
  }

  // TODO: Maybe should copy original PropTypes?
  WrapperComponent.propTypes = {
    kkey: PropTypes.string.isRequired,
  };

  return WrapperComponent;
}

export {
  ComponentStateProvider,
  componentStateReducer,
  ComponentStateScope,
  StatefulComponent,
  connect,
};

export default {
  ComponentStateProvider,
  componentStateReducer,
  ComponentStateScope,
  StatefulComponent,
  connect,
}
