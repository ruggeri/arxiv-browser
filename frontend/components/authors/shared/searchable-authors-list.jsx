import {fetchAuthorQueryResults} from 'actions/author-actions';
import AuthorsList from 'components/authors/shared/authors-list.jsx';
import ComponentStateStore from 'helpers/component-state-store';
import Pager from 'helpers/pager';
import DebouncedTextInput from 'helpers/debounced-text-input.jsx'
import Searcher from 'helpers/searcher';
import {List} from 'immutable';
import _ from 'lodash';
import {getAllAuthors, searchAuthors} from 'queries/author';
import React from 'react';
import * as ReactRedux from 'react-redux';

// basically just a shim.
const authorsList = ({items}) => (
  <AuthorsList authors={items}/>
);

const AuthorsListPager = ({authors}) => (
  <Pager items={authors} pageSize={5} component={authorsList}/>
);

class SearchableAuthorsList extends React.Component {
  constructor(props) {
    super(props);

    this.queryChangeHandler = this.queryChangeHandler.bind(this);
    this.searcher = new Searcher({
      didMatchResultsChange: (oldResults, newResults) => (
        !oldResults.equals(newResults)
      ),
      didItemsChange: (oldItems, newItems) => (
        !oldItems.equals(newItems)
      ),
      didQueryChange: (oldQuery, newQuery) => (
        !_.isEqual(oldQuery, newQuery)
      ),
      fetchNewResults: this.fetchNewResults.bind(this),
      updateMatchResults: this.updateMatchResults.bind(this),
    });

    this.state = {
      matchResults: List(),
      queryObj: {
        query: '',
        isAuthorStarred: false,
      },
    };
  }

  componentWillMount() {
    this.searcher.componentWillMount();
  }

  componentWillReceiveProps(nextProps) {
    this.searcher.componentWillReceiveProps({
      currentItems: this.props.authors,
      nextItems: nextProps.authors,
    });
  }

  fetchNewResults() {
    this.props.fetchAuthorQueryResults(this.state.queryObj);
  }

  queryChangeHandler(newQueryObj) {
    const newQuery = Object.assign(
      {}, this.state.queryObj, newQueryObj
    )
    this.setState({queryObj: newQueryObj});
  }

  setState(stateUpdate, cb) {
    const newState = Object.assign({}, this.state, stateUpdate);
    this.searcher.setState({
      currentQuery: this.state.queryObj,
      newQuery: newState.queryObj,
    });

    super.setState(stateUpdate, cb);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.searcher.shouldComponentUpdate({
      currentQueryObj: this.state.queryObj,
      currentMatchResults: this.state.matchResults,
      nextQueryObj: nextState.queryObj,
      nextMatchResults: nextState.matchResults,
    });
  }

  updateMatchResults() {
    let newMatchResults = this.props.searchAuthors(
      this.state.queryObj,
      this.props.authors,
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
        <DebouncedTextInput
          queryChangeHandler={this.queryChangeHandler}
          defaultQuery={queryObj.query}/>
        <AuthorsListPager authors={matchResults}/>
      </div>
    )
  }
}

let PersistableSearchableAuthorsList = ComponentStateStore.connect(
  SearchableAuthorsList
);

function performReactReduxConnect(component) {
  return ReactRedux.connect(
    (state) => ({
      authors: getAllAuthors(state),
      searchAuthors: (query, authors) => searchAuthors(state, query, authors),
    }),
    (dispatch) => ({
      fetchAuthorQueryResults: (query) => dispatch(fetchAuthorQueryResults(query)),
    })
  )(component);
}

SearchableAuthorsList = performReactReduxConnect(SearchableAuthorsList);
PersistableSearchableAuthorsList = performReactReduxConnect(PersistableSearchableAuthorsList);

export {
  PersistableSearchableAuthorsList,
  SearchableAuthorsList,
};
