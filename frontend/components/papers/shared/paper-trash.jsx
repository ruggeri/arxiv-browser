import { toggleIsIgnored } from 'actions/paper-status-actions';
import classNames from 'classnames';
import { isPaperIgnored } from 'queries/paper';
import React from 'react';
import { connect } from 'react-redux';

class PaperTrash extends React.PureComponent {
  render() {
    const { isIgnored, paper, toggleIsIgnored } = this.props;

    // In case we are are still loading.
    if (isIgnored === undefined) {
      return <i className="fa fa-spinner"></i>;
    }

    const starClassNames = classNames({
      fa: true,
      "fa-trash": isIgnored,
      "fa-trash-o": !isIgnored,
    });

    return (
      <i className={starClassNames} onClick={toggleIsIgnored}></i>
    );
  }
}

export default connect(
  (state, ownProps) => {
    const paperId = ownProps.paper.get('id');

    return {
      isIgnored: isPaperIgnored(state, {paperId}),
    }
  },
  (dispatch, ownProps) => {
    const paperId = ownProps.paper.get('id');

    return {
      toggleIsIgnored: () => dispatch(toggleIsIgnored(paperId)),
    };
  },
)(PaperTrash);
