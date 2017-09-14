import { toggleAuthorStar } from 'actions/author-status-actions';
import classNames from 'classnames';
import { isAuthorStarred } from 'queries/author';
import React from 'react';
import { connect } from 'react-redux';

class AuthorStar extends React.PureComponent {
  render() {
    const { author, isStarred, toggleAuthorStar } = this.props;

    // In case we are are still loading.
    if (isStarred === undefined) {
      return <i className="fa fa-spinner"></i>;
    }

    const starClassNames = classNames({
      fa: true,
      "fa-star": isStarred,
      "fa-star-o": !isStarred,
    });

    const clickHandler = () => toggleAuthorStar(author.get('id'));

    return (
      <i className={starClassNames} onClick={clickHandler}></i>
    );
  }
}

export default connect(
  (state, ownProps) => {
    const authorId = ownProps.author.get('id');

    return {
      isStarred: isAuthorStarred(state, {authorId}),
    }
  }, (dispatch) => ({
    toggleAuthorStar: (authorId) => dispatch(toggleAuthorStar(authorId)),
  }),
)(AuthorStar);
