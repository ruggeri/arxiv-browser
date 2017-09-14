import classNames from 'classnames';
import InlineAuthorsList from 'components/papers/index/inline-authors-list.jsx';
import PaperStar from 'components/papers/shared/paper-star.jsx';
import { authorsForPaperId } from 'query';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class PaperItem extends React.Component {
  render() {
    const { authors, paper, paperStatus } = this.props;
    const url = `/papers/${paper.get('id')}`

    const linkClass = classNames({
      paper: true,
      starred: paperStatus && paperStatus.get('isStarred')
    });

    let authorsElement = null;
    if (authors) {
      authorsElement = <InlineAuthorsList authors={authors}/>;
    }

    return (
      <span>
        <Link to={url} className={linkClass}>
          {paper.get('title')}
        </Link> <PaperStar paper={paper}/>
        {authorsElement}
      </span>
    );
  }
}

PaperItem = connect(
  (state, ownProps) => {
    const paperId = ownProps.paper.get('id');

    const props = {
      paperStatus: state.paperStatuses.get(paperId),
    };

    if (ownProps.showAuthors) {
      props.authors = authorsForPaperId(state, paperId);
    }

    return props;
  },
)(PaperItem);

export default PaperItem;
