import PropTypes from 'prop-types';
import React from 'react';

// You can use this to wrap a component and it will be passed some
// props: clearPersistedState, getPersistedState, and persistState. Your
// component can then use these.
//
// The component you wrap has to work with StatefulComponent and call
// the appropriate prop methods at appropriate times. Therefore, there
// can be a little shimming required to integrate with
// StatefulComponent.
//
// See `connect` which aims to do this shimming for you. But `connect`
// won't always work, so you can always fall back to StatefulComponent
// yourself.
export class StatefulComponent extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    kkey: PropTypes.string.isRequired,
  };

  static contextTypes = {
    clearComponentState: PropTypes.func.isRequired,
    componentStateKeyPath: PropTypes.string.isRequired,
    getComponentState: PropTypes.func.isRequired,
    saveComponentState: PropTypes.func.isRequired,
  };

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
