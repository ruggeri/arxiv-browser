import classNames from 'classnames';
import AuthorItem from 'components/authors/shared/author-item.jsx';
import ResultsPager from 'helpers/results-pager';
import { List } from 'immutable';
import React from 'react';

class AuthorsList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {authors: List()};
    this.authorsPager = new ResultsPager(5, pagedInAuthors => {
      this.setState({authors: pagedInAuthors })
    });
  }

  componentDidMount() {
    this.authorsPager.pageIn(this.props.authors);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.authors.equals(this.props.authors)) {
      this.authorsPager.pageIn(this.props.authors);
    }
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
