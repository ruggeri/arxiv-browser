import PropTypes from 'prop-types';
import React from 'react';

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
