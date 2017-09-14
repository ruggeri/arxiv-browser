import classNames from 'classnames';
import AuthorItem from 'components/authors/shared/author-item.jsx';
import { List } from 'immutable';
import React from 'react';

class AuthorsList extends React.PureComponent {
  render() {
    const { authors, inline } = this.props;

    const authorItems = authors.map(author => (
      <li key={author.get('id')}>
        <AuthorItem author={author}/>
      </li>
    ));

    const listClass = classNames({
      "inline-authors-list": inline,
    });

    return (
      <ul className={listClass}>{authorItems}</ul>
    );
  }
}

export default AuthorsList;
