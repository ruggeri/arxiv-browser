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
    this.searcher.componentWillMount(this.props, this.state);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const queryDidChange = !_.isEqual(
      this.state.queryObj, nextState.queryObj
    );
    const itemsDidChange = !this.props.authors.equals(nextProps.authors);
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
    props.fetchAuthorQueryResults(state.query);
  }

  queryChangeHandler(newQueryObj) {
    const newQuery = Object.assign(
      {}, this.state.queryObj, newQueryObj
    )
    this.setState({queryObj: newQueryObj});
  }

  updateMatchResults(props, state) {
    // TODO: Extend searchPapers to deal with query object!
    let newMatchResults = props.searchAuthors(
      state.queryObj,
      props.authors,
    );

    if (props.resultsLimit) {
      newMatchResults = newMatchResults.take(
        props.resultsLimit
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
