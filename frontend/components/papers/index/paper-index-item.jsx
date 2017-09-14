import InlineAuthorsList from 'components/papers/index/inline-authors-list.jsx';
import PaperStar from 'components/papers/shared/paper-star.jsx';
import { authorsForPaperId } from 'query';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class PaperIndexItem extends React.Component {
  render() {
    const { authors, paper } = this.props;
    const url = `/papers/${paper.get('id')}`

    return (
      <div>
        <Link to={url}>{paper.get('title')}</Link> <PaperStar paper={paper}/>
        <InlineAuthorsList authors={authors}/>
      </div>
    );
  }
}

PaperIndexItem = connect(
  (state, ownProps) => {
    const paperId = ownProps.paper.get('id');

    return {
      authors: authorsForPaperId(state, paperId),
    };
  }
)(PaperIndexItem);

export default PaperIndexItem;
