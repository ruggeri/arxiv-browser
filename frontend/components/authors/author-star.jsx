import classNames from 'classnames';
import React from 'react';

class AuthorStar extends React.Component {
  render() {
    const { authorStatus, toggleAuthorStar } = this.props;

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

// Container
import { connect } from 'react-redux';
import { toggleAuthorStar } from '../../actions/author-status-actions';

export default connect(
  (state) => ({}),
  (dispatch) => ({
    toggleAuthorStar: (authorId) => dispatch(toggleAuthorStar(authorId)),
  }),
)(AuthorStar);
