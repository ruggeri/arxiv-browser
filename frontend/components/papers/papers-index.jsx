import { fetchAllPapers } from 'actions/paper-actions';
import PapersList from 'components/papers/shared/papers-list.jsx';
import { hasStarredAuthor, isPaperArchived, isPaperStarred } from 'queries/paper';
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
    return papers.filter(paper => hasStarredAuthor(state, {paper}));
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

let t;
class PapersIndex extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchAllPapers();
  }

  render() {
    const { papers } = this.props;

    return (
      <div>
        <h1>There are {papers.count()} papers in the archive!</h1>
        <PapersList papers={papers} showAuthors={true}/>
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => {
    const papers = filterPapers(
      state,
      state.papers.valueSeq(),
      ownProps.filterName
    );

    return {
      papers: papers
    };
  },
  (dispatch) => ({
    fetchAllPapers: () => dispatch(fetchAllPapers()),
  }),
)(PapersIndex);
