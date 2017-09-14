import { fetchAllPapers } from 'actions/paper-actions';
import PapersList from 'components/papers/shared/papers-list.jsx';
import { isPaperArchived, isPaperStarred } from 'query';
import React from 'react';
import { connect } from 'react-redux';

const FILTERS = {
  default: (state, papers) => {
    return papers.filter(p => !isPaperArchived(state, {paper: p}));
  },

  starred: (state, papers) => {
    return papers.filter(p => isPaperStarred(state, {paper: p}));
  },

  starredAuthors: (state, papers) => {
    // TODO!
    return papers;
  }
}

class PapersIndex extends React.Component {
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
    const props = {
      papers: state.papers.valueSeq(),
    };

    let filter;
    if (ownProps.filter) {
      filter = FILTERS[ownProps.filter]
    } else {
      filter = FILTERS['default'];
    }
    props.papers = filter(state, props.papers);

    return props;
  },
  (dispatch) => ({
    fetchAllPapers: () => dispatch(fetchAllPapers()),
  }),
)(PapersIndex);
