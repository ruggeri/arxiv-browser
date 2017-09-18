import classNames from 'classnames';
import AuthorsList from 'components/authors/shared/authors-list.jsx';
import PaperStar from 'components/papers/shared/paper-star.jsx';
import PaperTrash from 'components/papers/shared/paper-trash.jsx';
import { authorsForPaper } from 'queries/author';
import { getPaperById, isPaperStarred } from 'queries/paper';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class PaperItem extends React.PureComponent {
  render() {
    const { authors, isStarred, paper } = this.props;
    const url = `/papers/${paper.get('id')}`

    const divClassName = classNames({
      "paper-item": true,
      ...this.props.classNames,
    });

    const linkClass = classNames({
      paper: true,
      starred: isStarred,
    });

    let authorsElement = null;
    if (authors) {
      authorsElement = <AuthorsList authors={authors} inline={true}/>;
    }

    return (
      <div className={divClassName} data-id={paper.get('id')}>
        <div className="row title-row">
          <div className="col-12">
            <Link to={url} className={linkClass}>
              {paper.get('title')}
            </Link>

            <div className="buttons pull-right">
              <PaperStar paper={paper}/>
              <PaperTrash paper={paper}/>
            </div>
          </div>
        </div>

        <div className="row author-row">
          <div className="col-11">
            {authorsElement}
          </div>
        </div>

        <div className="row summary-row">
          <div className="col-12">
            <p>{paper.get('summary')}</p>
          </div>
        </div>
      </div>
    );
  }
}

PaperItem = connect(
  (state, ownProps) => {
    const paperId = ownProps.paper.get('id');

    const props = {
      isStarred: isPaperStarred(state, {paperId}),
    };

    if (ownProps.showAuthors) {
      props.authors = authorsForPaper(state, {paperId});
    }

    return props;
  },
)(PaperItem);

export default PaperItem;
