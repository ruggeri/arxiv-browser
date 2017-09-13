import React from 'react';

class AuthorShow extends React.Component {
  componentDidMount() {
    // TODO: should refetch author here...
  }

  render() {
    const { author } = this.props;
    
    return (
      <h1>{author.get('name')}</h1>
    );
  }
}

// Container
import { connect } from 'react-redux';
// import { authorsByPaperId } from '../../query';
import { fetchAuthor } from '../../actions/paper-actions';

export default connect(
  (state, ownProps) => ({
    author: state.authors.get(parseInt(ownProps.match.params.authorId))
  }),
  (dispatch) => ({
    fetchAuthor: (authorId) => dispatch(fetchAuthor(authorId)),
  }),
)(AuthorShow);
