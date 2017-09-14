import AuthorItem from 'components/authors/shared/author-item.jsx';
import React from 'react';

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
