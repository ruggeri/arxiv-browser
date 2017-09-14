import { fetchAuthor } from 'actions/author-actions';
import PapersList from 'components/papers/shared/papers-list.jsx';
import AuthorStar from 'components/authors/shared/author-star.jsx';
import { getAuthorById } from 'queries/author';
import { papersForAuthor } from 'queries/paper';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class AuthorShow extends React.Component {
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
        <h1>
          {author.get('name')}
          <AuthorStar author={author}/>
        </h1>
        <PapersList papers={authoredPapers}/>
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
