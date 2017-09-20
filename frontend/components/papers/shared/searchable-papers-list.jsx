import {fetchPaperQueryResults} from 'actions/paper-actions';
import {PersistablePapersList} from 'components/papers/shared/papers-list.jsx';
import SearchStateButtons from 'components/papers/shared/search-state-buttons.jsx';
import ComponentStateStore from 'helpers/component-state-store';
import Pager from 'helpers/pager';
import DebouncedTextInput from 'helpers/debounced-text-input.jsx'
import Searcher from 'helpers/searcher';
import {List} from 'immutable';
import _ from 'lodash';
import {getAllPapers, searchPapers} from 'queries/paper';
import React from 'react';
import * as ReactRedux from 'react-redux';

// basically just a shim.
const persistablePapersList = ({items}) => (
  <PersistablePapersList papers={items} showAuthors={true} kkey="papers-list"/>
);

const PapersListPager = ({papers}) => (
  <Pager items={papers} pageSize={5} component={persistablePapersList}/>
);

class SearchablePapersList extends React.Component {
  constructor(props) {
    super(props);

    this.keyHandler = this.keyHandler.bind(this);
    this.queryChangeHandler = this.queryChangeHandler.bind(this);
    this.searcher = new Searcher({
      fetchNewResults: this.fetchNewResults.bind(this),
      didMatchResultsChange: (oldResults, newResults) => (
        !oldResults.equals(newResults)
      ),
      didItemsChange: (oldItems, newItems) => (
        !oldItems.equals(newItems)
      ),
      didQueryChange: (oldQuery, newQuery) => (
        !_.isEqual(oldQuery, newQuery)
      ),
      updateMatchResults: this.updateMatchResults.bind(this),
    });

    this.state = {
      matchResults: List(),
      queryObj: {
        query: '',
        requirePaperStarred: false,
        requireAuthorStarred: false,
      },
    };
  }

  componentWillMount() {
    this.searcher.componentWillMount();
    $(document.body).keydown(this.keyHandler);
  }

  keyHandler(e) {
    e = e.originalEvent;
    if (e.code === 'Escape') {
      // blur out of search
      if (document.activeElement) {
        $(document.activeElement).blur();
      }
    } else if (e.code === 'KeyZ') {
      _.delay(() => this.input.focus());
    }
  }

  componentWillUnmount() {
    $(document.body).off('keydown', this.keyHandler);
  }

  setState(stateUpdate, cb) {
    const newState = Object.assign({}, this.state, stateUpdate);
    this.searcher.setState({
      currentQuery: this.state.queryObj,
      newQuery: newState.queryObj,
    });

    super.setState(stateUpdate, cb);
  }

  componentWillReceiveProps(nextProps) {
    this.searcher.componentWillReceiveProps({
      currentItems: this.props.papers,
      nextItems: nextProps.papers
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.searcher.shouldComponentUpdate({
      currentQueryObj: this.state.queryObj,
      currentMatchResults: this.state.matchResults,
      nextQueryObj: nextState.queryObj,
      nextMatchResults: nextState.matchResults,
    });
  }

  fetchNewResults() {
    this.props.fetchPaperQueryResults(this.state.queryObj);
  }

  queryChangeHandler(queryObj) {
    const newQueryObj = Object.assign(
      {}, this.state.queryObj, queryObj
    );
    this.setState({queryObj: newQueryObj});
  }

  updateMatchResults() {
    // TODO: Extend searchPapers to deal with query object!
    let newMatchResults = this.props.searchPapers(
      this.state.queryObj,
      this.props.papers,
    );

    if (this.props.resultsLimit) {
      newMatchResults = newMatchResults.take(
        this.props.resultsLimit
      );
    }

    this.setState({matchResults: newMatchResults});
  }

  render() {
    const {matchResults, queryObj} = this.state;

    return (
      <div>
        <form className="searchable-papers-list-form">
          <DebouncedTextInput
            queryChangeHandler={this.queryChangeHandler}
            defaultQuery={queryObj.query}
            ref={(input) => { this.input = input }}
          />
          <SearchStateButtons/>
        </form>
        <PapersListPager papers={matchResults}/>
      </div>
    )
  }
}

let PersistableSearchablePapersList = ComponentStateStore.connect(
  SearchablePapersList
);

function performReactReduxConnect(component) {
  return ReactRedux.connect(
    (state) => ({
      papers: getAllPapers(state),
      searchPapers: (queryObj, papers) => searchPapers(state, queryObj, papers),
    }),
    (dispatch) => ({
      fetchPaperQueryResults: (query) => dispatch(fetchPaperQueryResults(query)),
    })
  )(component);
}

SearchablePapersList = performReactReduxConnect(SearchablePapersList);
PersistableSearchablePapersList = performReactReduxConnect(PersistableSearchablePapersList);

export {
  PersistableSearchablePapersList,
  SearchablePapersList,
};
