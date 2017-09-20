import { fetchPaper } from 'actions/paper-actions';
import AuthorsList from 'components/authors/shared/authors-list.jsx';
import PaperStar from 'components/papers/shared/paper-star.jsx';
import { authorsForPaper } from 'queries/author';
import { getPaper } from 'queries/paper';
import React from 'react';
import { connect } from 'react-redux';

class PaperShow extends React.PureComponent {
  componentDidMount() {
    this.props.fetchPaper(this.props.paperId);
  }

  render() {
    let { authors, paper } = this.props;

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

export default connect(
  (state, ownProps) => {
    const paperId = parseInt(ownProps.match.params.paperId);

    return {
      paper: getPaper(state, paperId),
      paperId: paperId,
      authors: authorsForPaper(state, {paperId}),
    };
  },
  (dispatch) => ({
    fetchPaper: (paperId) => dispatch(fetchPaper(paperId)),
  }),
)(PaperShow);
