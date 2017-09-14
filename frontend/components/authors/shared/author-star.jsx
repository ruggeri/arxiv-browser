import { toggleAuthorStar } from 'actions/author-status-actions';
import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';

class AuthorStar extends React.Component {
  render() {
    const { authorStatus, toggleAuthorStar } = this.props;

    // In case we are are still loading.
    if (!authorStatus) {
      return <i className="fa fa-spinner"></i>;
    }

    const starClassNames = classNames({
      fa: true,
      "fa-star": authorStatus.get('isStarred'),
      "fa-star-o": !authorStatus.get('isStarred'),
    });

    const clickHandler = () => toggleAuthorStar(authorStatus.get('authorId'));

    return (
      <i className={starClassNames} onClick={clickHandler}></i>
    );
  }
}

export default connect(
  (state, ownProps) => {
    const authorId = ownProps.author.get('id');

    return {
      authorStatus: state.authorStatuses.get(authorId),
    }
  }, (dispatch) => ({
    toggleAuthorStar: (authorId) => dispatch(toggleAuthorStar(authorId)),
  }),
)(AuthorStar);
