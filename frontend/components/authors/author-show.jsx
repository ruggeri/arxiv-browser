import { fetchAuthor } from 'actions/author-actions';
import { PersistablePapersList } from 'components/papers/shared/papers-list.jsx';
import AuthorStar from 'components/authors/shared/author-star.jsx';
import { ScrollRestorer } from 'helpers/component-state-store';
import { getAuthorById } from 'queries/author';
import { papersForAuthor } from 'queries/paper';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class AuthorShow extends React.PureComponent {
  componentDidMount() {
    this.props.fetchAuthor(this.props.authorId);
  }

  render() {
    const { author, authoredPapers } = this.props;

    if (!author) {
      return (
        <div>Loading!</div>
      );
    }

    return (
      <div>
        <ScrollRestorer/>
        <h1>
          {author.get('name')}
          <AuthorStar author={author}/>
        </h1>
        <PersistablePapersList
          papers={authoredPapers}
          showAuthors={true}
          kkey="authored-papers"
        />
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => {
    const authorId = parseInt(ownProps.match.params.authorId);

    return {
      author: getAuthorById(state, authorId),
      authorId: authorId,
      authoredPapers: papersForAuthor(state, {authorId})
    };
  },
  (dispatch) => ({
    fetchAuthor: (authorId) => dispatch(fetchAuthor(authorId)),
  }),
)(AuthorShow);
