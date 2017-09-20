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
      updateMatchResults: this.updateMatchResults.bind(this),
    });

    this.state = {
      matchResults: List(),
      query: {
        query: '',
        requirePaperStarred: false,
        requireAuthorStarred: false,
      },
    };
  }

  componentWillMount() {
    this.searcher.componentWillMount(this.props, this.state);
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

  shouldComponentUpdate(nextProps, nextState) {
    const queryDidChange = !_.isEqual(this.state.query, nextState.query);
    const itemsDidChange = !this.props.papers.equals(nextProps.papers);
    const matchResultsDidChange = (
      !this.state.matchResults.equals(nextState.matchResults)
    );

    return this.searcher.shouldComponentUpdate(
      {queryDidChange, itemsDidChange, matchResultsDidChange},
      nextProps,
      nextState,
    );
  }

  fetchNewResults(props, state) {
    props.fetchPaperQueryResults(state.query);
  }

  queryChangeHandler(query) {
    const newQuery = Object.assign({}, this.state.query, {query: query})
    this.setState({query: newQuery});
  }

  updateMatchResults(props, state) {
    // TODO: Extend searchPapers to deal with query object!
    let newMatchResults = props.searchPapers(
      state.query.query,
      props.papers,
    );

    if (props.resultsLimit) {
      newMatchResults = newMatchResults.take(
        props.resultsLimit
      );
    }

    this.setState({matchResults: newMatchResults});
  }

  render() {
    const {matchResults, query} = this.state;

    return (
      <div>
        <form className="searchable-papers-list-form">
          <DebouncedTextInput
            queryChangeHandler={this.queryChangeHandler}
            query={query.query}
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
      searchPapers: (query, papers) => searchPapers(state, query, papers),
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
