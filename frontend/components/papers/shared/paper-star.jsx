import { togglePaperStar } from 'actions/paper-status-actions';
import classNames from 'classnames';
import { isPaperStarred } from 'queries/paper';
import React from 'react';
import { connect } from 'react-redux';

class PaperStar extends React.Component {
  render() {
    const { isStarred, paper, togglePaperStar } = this.props;

    // In case we are are still loading.
    if (isStarred === undefined) {
      return <i className="fa fa-spinner"></i>;
    }

    const starClassNames = classNames({
      fa: true,
      "fa-star": isStarred,
      "fa-star-o": !isStarred,
    });

    const clickHandler = () => togglePaperStar(paper.get('id'));

    return (
      <i className={starClassNames} onClick={clickHandler}></i>
    );
  }
}

export default connect(
  (state, ownProps) => {
    const paperId = ownProps.paper.get('id');

    return {
      isStarred: isPaperStarred(state, {paperId}),
    }
  },
  (dispatch) => ({
    togglePaperStar: (paperId) => dispatch(togglePaperStar(paperId)),
  }),
)(PaperStar);
