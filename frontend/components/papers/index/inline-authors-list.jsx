import AuthorStar from 'components/authors/shared/author-star.jsx';
import React from 'react';
import { Link } from 'react-router-dom';

class InlineAuthorItem extends React.Component {
  render() {
    const { author } = this.props;
    const url = `/authors/${author.get('id')}`;
    return (
      <span>
        <Link to={url}>{author.get('name')}</Link>
        <AuthorStar author={author}/>
      </span>
    );
  }
}

class InlineAuthorsList extends React.Component {
  render() {
    const { authors } = this.props;
    const authorItems = authors.map(a => (
      <li key={a.get('name')}>
        <InlineAuthorItem author={a}/>
      </li>
    ));

    return (
      <ul className="paper-author-list">{authorItems}</ul>
    );
  }
}

export default InlineAuthorsList;
