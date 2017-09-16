import PropTypes from 'prop-types';
import React from 'react';

// This component saves the scroll position on unmount and restores it
// on mount. The intent is to use this at the top level of a route, so
// that it mounts once on navigation to the route, and unmounts once on
// navigation away from the route.
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

  // Because the page may be dynamically built, it may be that not
  // enough of the page has been loaded yet to restore to the correct
  // position. So we'll try a number of times (and then give up).
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

      console.log("Gave up: could not restore scroll position.");
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
