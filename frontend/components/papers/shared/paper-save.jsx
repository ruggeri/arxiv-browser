import { setState } from 'actions/paper-status-actions';
import classNames from 'classnames';
import { isPaperSavedForLaterReading } from 'queries/paper';
import React from 'react';
import { connect } from 'react-redux';

class PaperSave extends React.PureComponent {
  render() {
    const { isSaved, paper, setSaved } = this.props;

    // In case we are are still loading.
    if (isSaved === undefined) {
      return <i className="fa fa-spinner"></i>;
    }

    const starClassNames = classNames({
      fa: true,
      "fa-file-text": isSaved,
      "fa-file-text-o": !isSaved,
    });

    const clickHandler = () => toggleSavedForLaterReading(paper.get('id'));

    return (
      <i className={starClassNames} onClick={clickHandler}></i>
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
  (dispatch) => ({
    toggleSavedForLaterReading: (paperId) => dispatch(toggleSavedForLaterReading(paperId)),
  }),
)(PaperSave);
