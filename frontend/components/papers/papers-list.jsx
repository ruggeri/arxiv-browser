import React from 'react';

const PapersList = ({ papers }) => (
  <h1>There are {papers.size} papers in the archive!</h1>
);

// Container
import { connect } from 'react-redux';

export default connect(
  (state) => ({ papers: state.papers }),
  (dispatch) => ({}),
)(PapersList);
