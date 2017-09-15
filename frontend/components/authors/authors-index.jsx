import { fetchAllAuthors } from 'actions/author-actions';
import AuthorsList from 'components/authors/shared/authors-list.jsx';
import Pager from 'helpers/pager.jsx';
import Searcher from 'helpers/searcher.jsx';
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
      <Pager items={items} pageSize={1} component={this.authorsList}/>
    );
  }

  render() {
    const {authors} = this.props;

    const searchAuthors = query => {
      query = query.toLowerCase();
      return authors.filter(author => (
        author.get('name').toLowerCase().includes(query)
      ));
    }

    return (
      <Searcher searcher={searchAuthors} component={this.pager}/>
    );
  }
}

class AuthorsIndex extends React.PureComponent {
  componentDidMount() {
    this.props.fetchAllAuthors();
  }

  render() {
    const { authors } = this.props;

    return (
      <div>
        <h1>There are {authors.count()} authors in the archive!</h1>
        <SearchablePaginatedAuthorsList authors={authors}/>
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => {
    const authors = filterAuthors(
      state, getAllAuthors(state), ownProps.filterName
    );

    return {
      authors,
    };
  },
  (dispatch) => ({
    fetchAllAuthors: () => dispatch(fetchAllAuthors()),
  }),
)(AuthorsIndex);
