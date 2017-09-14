import { togglePaperArchived } from 'actions/paper-status-actions';
import classNames from 'classnames';
import { isPaperArchived } from 'queries/paper';
import React from 'react';
import { connect } from 'react-redux';

class PaperTrash extends React.PureComponent {
  render() {
    const { isArchived, paper, togglePaperArchived } = this.props;

    // In case we are are still loading.
    if (isArchived === undefined) {
      return <i className="fa fa-spinner"></i>;
    }

    const starClassNames = classNames({
      fa: true,
      "fa-trash": isArchived,
      "fa-trash-o": !isArchived,
    });

    const clickHandler = () => togglePaperArchived(paper.get('id'));

    return (
      <i className={starClassNames} onClick={clickHandler}></i>
    );
  }
}

export default connect(
  (state, ownProps) => {
    const paperId = ownProps.paper.get('id');

    return {
      isArchived: isPaperArchived(state, {paperId}),
    }
  },
  (dispatch) => ({
    togglePaperArchived: (paperId) => dispatch(togglePaperArchived(paperId)),
  }),
)(PaperTrash);
