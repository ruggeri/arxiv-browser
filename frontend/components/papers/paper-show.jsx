import React from 'react';
import { Link } from 'react-router-dom'

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

class PaperShow extends React.Component {
  componentDidMount() {
    this.props.fetchPaper(this.props.paperId);
  }

  render() {
    let { paper, authors } = this.props;
    
    if (!paper) {
      return (
        <div>Loading!</div>
      );
    }

    return (
      <div>
        <h1>{paper.get('title')}</h1>
        <AuthorsList authors={authors}/>
      </div>
    );
  }
}

// Container
import { connect } from 'react-redux';
import { authorsForPaperId } from '../../query';
import { fetchPaper } from '../../actions/paper-actions';

export default connect(
  (state, ownProps) => {
    const paperId = parseInt(ownProps.match.params.paperId);
    
    return {
      paper: state.papers.get(paperId),
      paperId: paperId,
      authors: authorsForPaperId(state, paperId)
    };
  },
  (dispatch) => ({
    fetchPaper: (paperId) => dispatch(fetchPaper(paperId)),
  }),
)(PaperShow);
