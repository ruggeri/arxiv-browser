import React from 'react';
import { Link } from 'react-router-dom';

class AuthorItem extends React.Component {
  render() {
    const { author } = this.props;
    const url = `/authors/${author.get('id')}`
    return <Link to={url}>{author.get('name')}</Link>;
  }
}

class AuthorsList extends React.Component {
  render() {
    const { authors } = this.props;

    const authorItems = authors.map(author => (
      <li key={author.get('id')}>
        <AuthorItem author={author}/>
      </li>
    ));

    return (
      <ul>{authorItems}</ul>
    );
  }
}

export default AuthorsList;
