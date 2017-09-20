import _ from 'lodash';

export default class Searcher {
  constructor(options) {
    const {
      didMatchResultsChange,
      didItemsChange,
      didQueryChange,
      fetchNewResults,
      updateMatchResults,
    } = options;

    this.fetchNewResults = fetchNewResults;
    this.updateMatchResults = updateMatchResults;

    this.didItemsChange = didItemsChange;
    this.didMatchResultsChange = didMatchResultsChange;
    this.didQueryChange = didQueryChange;
  }

  componentWillMount() {
    _.delay(() => {
      this.updateMatchResults();
      this.fetchNewResults();
    });
  }

  componentWillReceiveProps({currentItems, nextItems}) {
    if (this.didItemsChange(currentItems, nextItems)) {
      _.delay(() => {
        this.updateMatchResults();
      });
    }
  }

  setState({currentQuery, newQuery}) {
    if (this.didQueryChange(currentQuery, newQuery)) {
      _.delay(() => {
        this.updateMatchResults();
        this.fetchNewResults();
      });
    }
  }

  shouldComponentUpdate(params) {
    const {
      currentQuery,
      currentMatchResults,
      nextQuery,
      nextMatchResults,
    } = params;

    if (this.didQueryChange(currentQuery, nextQuery)) {
      return true;
    } else if (this.didMatchResultsChange(currentMatchResults, nextMatchResults)) {
      return true;
    }

    return false;
  }
}
