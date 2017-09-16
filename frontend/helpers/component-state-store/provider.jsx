import { clearComponentState, saveComponentState } from './actions';
import PropTypes from 'prop-types';
import React from 'react';

// The Provider component provides as context to all descendent React
// elements functions for getting, saving, and clearing component
// state.
//
// It also provides a componentStateKeyPath. This keyPath is like a
// directory unique to the current history location.
//
// The idea is that the same component can save their state at multiple
// keyPaths: one per history location. That way as you traverse
// backward and forward through browser history, the component is able
// to load the specific version of its state that it saved for that
// history location.
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
      // It is expected that components may want to clear the component
      // state when they unmount. There should be one special exception:
      // when a component unmounts because of a history navigation
      // event.
      //
      // Therefore we here try to detect whether the
      // clearComponentState was issued because of a navigation. It's
      // tricky, but apparently an unmounting component won't see our
      // new context, so they'll issue a clearComponentState under the
      // old historyKey, not the currentHistoryKey.
      //
      // TODO: This feels brittle. Ideally the component would not
      // initiate a clearComponentState at all if it could know that it
      // was unmounting due to navigation. As ever, it is more
      // confusing to try to cancel something that should never have
      // happened in the first place.
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
