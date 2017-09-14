import classNames from 'classnames';
import AuthorsList from 'components/authors/shared/authors-list.jsx';
import PaperStar from 'components/papers/shared/paper-star.jsx';
import { authorsForPaper } from 'queries/author';
import { getPaperById, isPaperStarred } from 'queries/paper';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class PaperItem extends React.PureComponent {
  render() {
    const { authors, isStarred, paper } = this.props;
    const url = `/papers/${paper.get('id')}`

    const linkClass = classNames({
      paper: true,
      starred: isStarred,
    });

    let authorsElement = null;
    if (authors) {
      authorsElement = <AuthorsList authors={authors} inline={true}/>;
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
      isStarred: isPaperStarred(state, {paperId}),
    };

    if (ownProps.showAuthors) {
      props.authors = authorsForPaper(state, {paperId});
    }

    return props;
  },
)(PaperItem);

export default PaperItem;
