import React from 'react';
import PaperStar from './paper-star.jsx';
import AuthorsList from '../authors/authors-list.jsx';

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
          <PaperStar paperStatus={paperStatus}/>
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
      paperStatus: state.paperStatuses.get(paperId),
      authors: authorsForPaperId(state, paperId),
    };
  },
  (dispatch) => ({
    fetchPaper: (paperId) => dispatch(fetchPaper(paperId)),
  }),
)(PaperShow);
