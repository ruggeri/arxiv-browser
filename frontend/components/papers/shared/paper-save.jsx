import { toggleIsSavedForLaterReading } from 'actions/paper-status-actions';
import classNames from 'classnames';
import { isPaperSavedForLaterReading } from 'queries/paper';
import React from 'react';
import { connect } from 'react-redux';

class PaperSave extends React.PureComponent {
  render() {
    const { isSaved, paper, toggleIsSavedForLaterReading } = this.props;

    // In case we are are still loading.
    if (isSaved === undefined) {
      return <i className="fa fa-spinner"></i>;
    }

    const savedClassNames = classNames({
      fa: true,
      "fa-file": true,
      active: isSaved,
      "search-state-button": true,
    });

    return (
      <i className={savedClassNames} onClick={toggleIsSavedForLaterReading}></i>
    );
  }
}

export default connect(
  (state, ownProps) => {
    const paperId = ownProps.paper.get('id');

    return {
      isSaved: isPaperSavedForLaterReading(state, {paperId}),
    }
  },
  (dispatch, ownProps) => {
    const paperId = ownProps.paper.get('id');

    return {
      toggleIsSavedForLaterReading: () => dispatch(toggleIsSavedForLaterReading(paperId)),
    };
  },
)(PaperSave);
