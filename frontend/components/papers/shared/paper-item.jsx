import classNames from 'classnames';
import AuthorsList from 'components/authors/shared/authors-list.jsx';
import PaperStar from 'components/papers/shared/paper-star.jsx';
import PaperTrash from 'components/papers/shared/paper-trash.jsx';
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
      <tr className={this.props.className} data-id={paper.get('id')}>
        <td>
          <Link to={url} className={linkClass}>
            {paper.get('title')}
          </Link>
        </td>
        <td><PaperStar paper={paper}/></td>
        <td><PaperTrash paper={paper}/></td>
        <td>{authorsElement}</td>
      </tr>
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
