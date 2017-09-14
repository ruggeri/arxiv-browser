import React from 'react';
import { connect } from 'react-redux';
import { fetchAllPapers } from 'actions/paper-actions';
import PapersIndexList from 'components/papers/index/papers-index-list.jsx';

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
        <PapersIndexList papers={papers}/>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    papers: state.papers,
  }),
  (dispatch) => ({
    fetchAllPapers: () => dispatch(fetchAllPapers()),
  }),
)(PapersIndex);
