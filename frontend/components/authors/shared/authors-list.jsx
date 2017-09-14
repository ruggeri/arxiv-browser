import classNames from 'classnames';
import AuthorItem from 'components/authors/shared/author-item.jsx';
import PagerComponent from 'helpers/pager-component';
import { List } from 'immutable';
import React from 'react';

class AuthorsList extends PagerComponent {
  constructor(props) {
    super(props, {collectionName: 'authors', pageSize: 5, usePager: props.paginate});
  }

  render() {
    const { inline } = this.props;
    const { authors } = this.state;

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
