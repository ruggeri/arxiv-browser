import { fetchAuthorQueryResults } from 'actions/author-actions';
import AuthorsList from 'components/authors/shared/authors-list.jsx';
import { ScrollRestorer } from 'helpers/component-state-store';
import Pager from 'helpers/pager';
import { PersistableSearcher } from 'helpers/searcher.jsx';
import React from 'react';
import { connect } from 'react-redux';
import { getAllAuthors, isAuthorStarred } from 'queries/author';

const FILTERS = {
  default: (state, authors) => {
    return authors;
  },

  starred: (state, authors) => {
    return authors.filter(author => isAuthorStarred(state, {author}));
  },
}

function filterAuthors(state, authors, filterName) {
  let filterFn;
  if (filterName) {
    filterFn = FILTERS[filterName]
  } else {
    filterFn = FILTERS['default'];
  }
  return filterFn(state, authors);
}

class SearchablePaginatedAuthorsList extends React.PureComponent {
  constructor(props) {
    super(props)

    // See the discussion in PapersIndex for an explanation of how
    // we must be careful to define functional components once or they
    // won't reconcile nicely.
    this.authorsList = ({items}) => (
      <AuthorsList authors={items}/>
    );
    this.pager = ({items}) => (
      <Pager items={items} pageSize={20} component={this.authorsList}/>
    );
  }

  render() {
    const {authors, executeQuery, searchAuthors} = this.props;

    return (
      <PersistableSearcher
        searcher={searchAuthors}
        component={this.pager}
        executeQuery={executeQuery}
        kkey="searcher"
        resultsLimit={20}
      />
    );
  }
}

class AuthorsIndex extends React.PureComponent {
  render() {
    const { authors } = this.props;

    return (
      <div>
        <ScrollRestorer/>
        <h1>There are {authors.count()} authors in the archive!</h1>
        <SearchablePaginatedAuthorsList {...this.props}/>
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => {
    const authors = filterAuthors(
      state, getAllAuthors(state), ownProps.filterName
    );
    const searchAuthors = query => {
      query = query.toLowerCase();
      return authors.filter(author => (
        author.get('name').toLowerCase().includes(query)
      ));
    }

    return {
      authors,
      searchAuthors
    };
  },
  (dispatch, ownProps) => {
    const executeQuery = (query) => (
      fetchAuthorQueryResults({
        query: query,
        isAuthorStarred: ownProps.filterName == 'starred',
      })
    );

    return {
      executeQuery: query => dispatch(executeQuery(query)),
    };
  },
)(AuthorsIndex);
