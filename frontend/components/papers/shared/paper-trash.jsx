import { setState } from 'actions/paper-status-actions';
import classNames from 'classnames';
import { isPaperIgnored } from 'queries/paper';
import React from 'react';
import { connect } from 'react-redux';

class PaperTrash extends React.PureComponent {
  render() {
    const { isIgnored, paper, setIgnored } = this.props;

    // In case we are are still loading.
    if (isIgnored === undefined) {
      return <i className="fa fa-spinner"></i>;
    }

    const starClassNames = classNames({
      fa: true,
      "fa-trash": isIgnored,
      "fa-trash-o": !isIgnored,
    });

    const clickHandler = () => setIgnored(paper.get('id'));

    return (
      <i className={starClassNames} onClick={clickHandler}></i>
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
  (dispatch) => ({
    setIgnored: (paperId) => dispatch(setState(paperId, 'isIgnored')),
  }),
)(PaperTrash);
