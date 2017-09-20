import { toggleIsReviewed } from 'actions/paper-status-actions';
import classNames from 'classnames';
import { isReviewed } from 'queries/paper';
import React from 'react';
import { connect } from 'react-redux';

class PaperMarkReviewed extends React.PureComponent {
  render() {
    const { isReviewed, paper, toggleIsReviewed } = this.props;

    // In case we are are still loading.
    if (isReviewed === undefined) {
      return <i className="fa fa-spinner"></i>;
    }

    const savedClassNames = classNames({
      fa: true,
      "fa-book": true,
      "active": isReviewed,
      "search-state-button": true,
    });

    return (
      <i className={savedClassNames} onClick={toggleIsReviewed}></i>
    );
  }
}

export default connect(
  (state, ownProps) => {
    const paperId = ownProps.paper.get('id');

    return {
      isReviewed: isReviewed(state, {paperId}),
    }
  },
  (dispatch, ownProps) => {
    const paperId = ownProps.paper.get('id');

    return {
      toggleIsReviewed: () => dispatch(toggleIsReviewed(paperId)),
    };
  },
)(PaperMarkReviewed);
