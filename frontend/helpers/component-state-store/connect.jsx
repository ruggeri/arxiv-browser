import PropTypes from 'prop-types';
import React from 'react';
import { StatefulComponent } from './stateful-component.jsx';

export function connect(component) {
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
