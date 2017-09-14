import { fetchAllPapers } from 'actions/paper-actions';
import PapersList from 'components/papers/shared/papers-list.jsx';
import React from 'react';
import { connect } from 'react-redux';

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
        <h1>There are {papers.size} papers in the archive!</h1>
        <PapersList papers={papers} showAuthors={true}/>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    papers: state.papers.valueSeq(),
  }),
  (dispatch) => ({
    fetchAllPapers: () => dispatch(fetchAllPapers()),
  }),
)(PapersIndex);
