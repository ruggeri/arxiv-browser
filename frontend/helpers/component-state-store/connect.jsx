import PropTypes from 'prop-types';
import React from 'react';
import { StatefulComponent } from './stateful-component.jsx';

// Takes a component and generates a subclass which differs in that it
// will initialize from persistedState on mounting, persist the state on
// state updates, and clear the state on unmounting. It then kindly
// wraps this in a StatefulComponent so you don't have to do this.
//
// connect is somewhat naive and won't work in all scenarios. For
// instance, imagine that a component state was set to show a spinner as
// it waited for an AJAX request to be fulfilled. On navigation away
// from the history location, the AJAX request may be canceled. But when
// the component re-mounts on navigation back, the spinner may be shown
// again, waiting for an AJAX response that will now never return.
export function connect(component) {
  if (!component.prototype.isReactComponent) {
    // Connect needs to replace methods directly on the stateful
    // component class. So if it is hidden behind a functional
    // component, which happens a lot with wrapper classes, then
    // we won't be able to install these methods properly.
    throw "You cannot connect to a functional component!";
  }
  class ExtendedComponent extends component {
    constructor(props) {
      super(props);

      const persistedState = this.props.getPersistedState();
      if (persistedState) {
        this.state = persistedState;
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
      if (super.componentWillUnmount) {
        super.componentWillUnmount();
      }

      this.props.clearPersistedState();
    }
  }

  class WrapperComponent extends React.Component {
    // TODO: Maybe should copy original PropTypes?
    static propTypes = {
      kkey: PropTypes.string.isRequired,
    };

    render() {
      return (
        <StatefulComponent kkey={this.props.kkey}>
          <ExtendedComponent {...this.props}/>
        </StatefulComponent>
      )
    }
  }

  return WrapperComponent;
}
