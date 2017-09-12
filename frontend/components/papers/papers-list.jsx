import React from 'react';

class PapersList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchPapers();
  }

  render() {
    const { papers } = this.props;
    return <h1>There are {papers.size} papers in the archive!</h1>;
  }
}

// Container
import { connect } from 'react-redux';
import { fetchPapers } from '../../actions/paper-actions.js';

export default connect(
  (state) => ({
    papers: state.papers,
  }),
  (dispatch) => ({
    fetchPapers: () => dispatch(fetchPapers()),
  }),
)(PapersList);
