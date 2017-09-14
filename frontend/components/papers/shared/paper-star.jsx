import { togglePaperStar } from 'actions/paper-status-actions';
import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';

class PaperStar extends React.Component {
  render() {
    const { paperStatus, togglePaperStar } = this.props;

    // In case we are are still loading.
    if (!paperStatus) {
      return <i className="fa fa-spinner"></i>;
    }

    const starClassNames = classNames({
      fa: true,
      "fa-star": paperStatus.get('isStarred'),
      "fa-star-o": !paperStatus.get('isStarred'),
    });

    const clickHandler = () => togglePaperStar(paperStatus.get('paperId'));

    return (
      <i className={starClassNames} onClick={clickHandler}></i>
    );
  }
}

export default connect(
  (state, ownProps) => {
    const paperId = ownProps.paper.get('id');

    return {
      paperStatus: state.paperStatuses.get(paperId),
    }
  },
  (dispatch) => ({
    togglePaperStar: (paperId) => dispatch(togglePaperStar(paperId)),
  }),
)(PaperStar);
