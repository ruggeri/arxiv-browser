import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class PaperItem extends React.Component {
  render() {
    const { paper } = this.props;
    const url = `/papers/${paper.get('id')}`
    return <Link to={url}>{paper.get('title')}</Link>;
  }
}

PaperItem = connect(
  (state, ownProps) => {
    const paperId = ownProps.paper.get('id');

    return {
      authorStatus: state.paperStatuses.get(paperId),
    };
  },
)(PaperItem);

export default PaperItem;
