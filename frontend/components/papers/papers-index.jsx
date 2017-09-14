import { fetchAllPapers } from 'actions/paper-actions';
import PapersList from 'components/papers/shared/papers-list.jsx';
import Pager from 'helpers/pager.jsx';
import Searcher from 'helpers/searcher.jsx';
import { getAllPapers, hasStarredAuthor, isPaperArchived, isPaperStarred } from 'queries/paper';
import React from 'react';
import { connect } from 'react-redux';

const FILTERS = {
  default: (state, papers) => {
    return papers.filter(paper => !isPaperArchived(state, {paper}));
  },

  starred: (state, papers) => {
    return papers.filter(paper => isPaperStarred(state, {paper}));
  },

  starredAuthors: (state, papers) => {
    return papers.filter(paper => (
      hasStarredAuthor(state, {paper}) && !isPaperArchived(state, {paper})
    ));
  }
}

function filterPapers(state, papers, filterName) {
  let filterFn;
  if (filterName) {
    filterFn = FILTERS[filterName]
  } else {
    filterFn = FILTERS['default'];
  }
  return filterFn(state, papers);
}

class SearchablePaginatedPapersList extends React.PureComponent {
  render() {
    const {papers} = this.props;
    return (
      <Searcher items={papers} searchFieldName="title" component={({items}) => (
        <Pager items={items} pageSize={1} component={({items}) => (
          <PapersList papers={items} showAuthors={true}/>
        )}/>
      )}/>
    );
  }
}

class PapersIndex extends React.PureComponent {
  componentDidMount() {
    this.props.fetchAllPapers();
  }

  render() {
    const { papers } = this.props;

    return (
      <div>
        <h1>There are {papers.count()} papers in the archive!</h1>
        <SearchablePaginatedPapersList papers={papers}/>
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => {
    const papers = filterPapers(
      state, getAllPapers(state), ownProps.filterName
    );

    return {
      papers,
    };
  },
  (dispatch) => ({
    fetchAllPapers: () => dispatch(fetchAllPapers()),
  }),
)(PapersIndex);
