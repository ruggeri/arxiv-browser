import AuthorsList from 'components/authors/shared/authors-list.jsx';
import PaperStar from 'components/papers/shared/paper-star.jsx';
import React from 'react';

class PaperShow extends React.Component {
  componentDidMount() {
    this.props.fetchPaper(this.props.paperId);
  }

  render() {
    let { authors, paper, paperStatus } = this.props;

    if (!paper) {
      return (
        <div>Loading!</div>
      );
    }

    return (
      <div>
        <h1>
          {paper.get('title')}
          <PaperStar paper={paper}/>
        </h1>
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
      authors: authorsForPaperId(state, paperId),
    };
  },
  (dispatch) => ({
    fetchPaper: (paperId) => dispatch(fetchPaper(paperId)),
  }),
)(PaperShow);
