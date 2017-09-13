import classNames from 'classnames';
import React from 'react';

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

// Container
import { connect } from 'react-redux';
import { togglePaperStar } from '../../actions/paper-status-actions';

export default connect(
  (state) => ({}),
  (dispatch) => ({
    togglePaperStar: (paperId) => dispatch(togglePaperStar(paperId)),
  }),
)(PaperStar);
