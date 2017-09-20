import _ from 'lodash';

export default class Searcher {
  constructor({fetchNewResults, updateMatchResults}) {
    this.callbacks = {
      fetchNewResults,
      updateMatchResults,
    };
  }

  componentWillMount(props, state) {
    this.shouldComponentUpdate({
      queryDidChange: true,
      itemsDidChange: true,
      matchResultsDidChange: true,
    }, props, state);
  }

  shouldComponentUpdate(changes, props, state) {
    const {
      queryDidChange,
      itemsDidChange,
      matchResultsDidChange
    } = changes;

    if (queryDidChange) {
      _.defer(() => {
        this.callbacks.fetchNewResults(props, state);
        this.callbacks.updateMatchResults(props, state);
      });
      return true;
    }

    if (itemsDidChange) {
      _.defer(() => {
        this.callbacks.updateMatchResults(props, state);
      });
      return true;
    }

    if (matchResultsDidChange) {
      return true;
    }

    return false;
  }
}
