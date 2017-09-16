import { clearComponentState, saveComponentState } from './actions';
import PropTypes from 'prop-types';
import React from 'react';

export class ComponentStateProvider extends React.Component {
  static childContextTypes = {
    clearComponentState: PropTypes.func.isRequired,
    componentStateKeyPath: PropTypes.string.isRequired,
    getComponentState: PropTypes.func.isRequired,
    saveComponentState: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  getChildContext() {
    const historyKey = this.context.router.history.location.key;
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
    const currentHistoryKey = this.context.router.history.location.key;
    if (!keyPath.startsWith(`/${currentHistoryKey}`)) {
      // This clear event is due to a history transition. We don't want
      // to perform it.
      return;
    }

    this.context.store.dispatch(clearComponentState(keyPath));
  }

  getComponentState(keyPath) {
    return this.context.store.getState().componentState.get(keyPath);
  }

  saveComponentState(keyPath, state) {
    this.context.store.dispatch(saveComponentState(keyPath, state));
  }
}
