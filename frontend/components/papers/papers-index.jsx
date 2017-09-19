import { fetchLatestPapers, fetchPaperQueryResults } from 'actions/paper-actions';
import { PersistablePapersList } from 'components/papers/shared/papers-list.jsx';
import ComponentStateStore from 'helpers/component-state-store';
import Pager from 'helpers/pager';
import { PersistableSearcher } from 'helpers/searcher.jsx';
import { getAllPapers, hasStarredAuthor, isPaperArchived, isPaperStarred, searchPapers } from 'queries/paper';
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
  constructor(props) {
    super(props)

    // Note! I used to define these functional components inside
    // render. But that meant that on re-render, React wasn't able
    // to reconcile the new function with the previous one. So even
    // if no props changed, everything got unmounted and remounted. Wow!
    this.papersList = ({items}) => (
      <PersistablePapersList papers={items} showAuthors={true} kkey="papers-list"/>
    );
    this.pager = ({items}) => (
      <Pager items={items} pageSize={5} component={this.papersList}/>
    );
  }

  render() {
    const {executeQuery, searchPapers} = this.props;

    return (
      <PersistableSearcher
        component={this.pager}
        executeQuery={executeQuery}
        kkey="searcher"
        minQueryLength={3}
        resultsLimit={20}
        searcher={searchPapers}
      />
    );
  }
}

class PapersIndex extends React.PureComponent {
  componentDidMount() {
    this.props.executeQuery('');
  }

  render() {
    const { papers } = this.props;

    return (
      <div>
        <ComponentStateStore.ScrollRestorer/>
        <h1>There are {papers.count()} papers in the archive!</h1>
        <SearchablePaginatedPapersList {...this.props}/>
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
      papers: papers,
      searchPapers: query => searchPapers(state, query, papers),
    };
  },
  (dispatch, ownProps) => {
    const executeQuery = (query) => (
      fetchPaperQueryResults({
        query: query,
        isPaperStarred: ownProps.filterName == 'starred',
        isAuthorStarred: ownProps.filterName == 'starredAuthors',
      })
    )

    return {
      executeQuery: query => dispatch(executeQuery(query)),
    };
  },
)(PapersIndex);
