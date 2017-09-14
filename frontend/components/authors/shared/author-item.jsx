import classNames from 'classnames';
import AuthorStar from 'components/authors/shared/author-star.jsx';
import { isAuthorStarred } from 'queries/author';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class AuthorItem extends React.Component {
  render() {
    const { author, isStarred } = this.props;
    const url = `/authors/${author.get('id')}`

    const linkClass = classNames({
      author: true,
      starred: isStarred,
    });

    return (
      <span>
        <Link to={url} className={linkClass}>
          {author.get('name')}
        </Link> <AuthorStar author={author}/>
      </span>
    );
  }
}

AuthorItem = connect(
  (state, ownProps) => {
    const authorId = ownProps.author.get('id');

    const props = {
      isStarred: isAuthorStarred(state, {authorId}),
    };

    return props;
  },
)(AuthorItem);

export default AuthorItem;
