import React from 'react';
import { Link } from 'react-router-dom';
import AuthorStar from './author-star.jsx';

class AuthoredPaperItem extends React.Component {
  render() {
    const { paper } = this.props;
    const url = `/papers/${paper.get('id')}`
    return <Link to={url}>{paper.get('title')}</Link>;
  }
}

class AuthoredPapersList extends React.Component {
  render() {
    const { papers } = this.props;

    const paperItems = papers.map(paper => (
      <li key={paper.get('id')}>
        <AuthoredPaperItem paper={paper}/>
      </li>
    ));

    return (
      <ul>{paperItems}</ul>
    );
  }
}

class AuthorShow extends React.Component {
  componentDidMount() {
    this.props.fetchAuthor(this.props.authorId);
  }

  render() {
    const { author, authorStatus, papers } = this.props;

    if (!author) {
      return (
        <div>Loading!</div>
      );
    }

    return (
      <div>
        <h1>
          {author.get('name')}
          <AuthorStar authorStatus={authorStatus}/>
        </h1>
        <AuthoredPapersList papers={papers}/>
      </div>
    );
  }
}

// Container
import { connect } from 'react-redux';
import { papersForAuthorId } from '../../query';
import { fetchAuthor } from '../../actions/author-actions';

export default connect(
  (state, ownProps) => {
    const authorId = parseInt(ownProps.match.params.authorId);
    
    return {
      author: state.authors.get(authorId),
      authorStatus: state.authorStatuses.get(authorId),
      authorId: authorId,
      papers: papersForAuthorId(state, authorId)
    };
  },
  (dispatch) => ({
    fetchAuthor: (authorId) => dispatch(fetchAuthor(authorId)),
  }),
)(AuthorShow);
