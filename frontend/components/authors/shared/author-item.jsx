import AuthorStar from 'components/authors/shared/author-star.jsx';
import React from 'react';
import { Link } from 'react-router-dom';

class AuthorItem extends React.Component {
  render() {
    const { author } = this.props;
    const url = `/authors/${author.get('id')}`
    return (
      <span>
        <Link to={url}>{author.get('name')}</Link> <AuthorStar author={author}/>
      </span>
    );
  }
}

export default AuthorItem;
