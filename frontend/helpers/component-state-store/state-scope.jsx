import PropTypes from 'prop-types';
import React from 'react';

export class ComponentStateScope extends React.Component {
  static childContextTypes = {
    componentStateKeyPath: PropTypes.string.isRequired,
  };
  static contextTypes = {
    componentStateKeyPath: PropTypes.string.isRequired
  };
  static propTypes = {
    kkey: PropTypes.string.isRequired,
  };

  getChildContext() {
    const currentKeyPath = this.context.componentStateKeyPath;
    const childKeyPath = `${currentKeyPath}/${this.props.kkey}`;
    return {
      componentStateKeyPath: childKeyPath
    };
  }
}
