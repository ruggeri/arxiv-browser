import PropTypes from 'prop-types';
import React from 'react';

export class ScrollRestorer extends React.Component {
  static contextTypes = {
    getComponentState: PropTypes.func.isRequired,
    componentStateKeyPath: PropTypes.string.isRequired,
    saveComponentState: PropTypes.func.isRequired,
  };
  static maxAttempts = 20;
  static timeBetweenAttempts = 20;

  attemptToRestoreScroll(targetScrollPosition) {
    if (this.isDocumentLongEnoughToRestoreScroll(targetScrollPosition)) {
      window.scroll(0, targetScrollPosition);
      return true;
    }

    return false;
  }

  isDocumentLongEnoughToRestoreScroll(targetScrollPosition) {
    const targetScrollBottom = targetScrollPosition + document.body.clientHeight;
    return document.body.scrollHeight >= targetScrollBottom
  }

  keyPath() {
    return `${this.context.componentStateKeyPath}/scrollPosition`;
  }

  async restoreScrollPosition() {
    const targetScrollPosition = this.storedScrollPosition();
    if (targetScrollPosition) {
      for (let iter = 0; iter < ScrollRestorer.maxAttempts; iter += 1) {
        const didRestore = this.attemptToRestoreScroll(targetScrollPosition);
        if (didRestore) {
          return;
        }
        await new Promise(resolve => {
          setTimeout(resolve, ScrollRestorer.timeBetweenAttempts)
        });
      }
    }
  }

  storedScrollPosition() {
    return this.context.getComponentState(this.keyPath());
  }

  componentWillMount() {
    this.restoreScrollPosition();
  }

  componentWillUnmount() {
    this.context.saveComponentState(this.keyPath(), window.scrollY);
  }

  render() {
    return null;
  }
}
