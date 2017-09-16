import PropTypes from 'prop-types';
import React from 'react';

// This component creates a "directory" in the keyPath. This could be
// useful if there are components for a list of items, and each item
// would otherwise want to store some state under the same key name.
// In that case, we would put each item in its own "directory", so that
// all keyPaths would stay unique.
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
