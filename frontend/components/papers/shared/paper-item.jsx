import classNames from 'classnames';
import AuthorsList from 'components/authors/shared/authors-list.jsx';
import PaperStar from 'components/papers/shared/paper-star.jsx';
import PaperTrash from 'components/papers/shared/paper-trash.jsx';
import _ from 'lodash';
import { authorsForPaper } from 'queries/author';
import { getPaperById, isPaperStarred } from 'queries/paper';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const PaperTitleRow = ({ isStarred, paper }) => (
  <div className="row title-row">
    <div className="col-11">
      <Link
        to={`/papers/${paper.get('id')}`}
        className={classNames({paper: true, starred: isStarred})}>
        {paper.get('title')}
      </Link>
    </div>

    <div className="buttons">
      <PaperStar paper={paper}/>
      <PaperTrash paper={paper}/>
    </div>
  </div>
);

const PaperAuthorsRow = ({ authors }) => (
  <div className="row author-row">
    <div className="col-11">
      {authors && <AuthorsList authors={authors} inline={true}/>}
    </div>
  </div>
);

const PaperPublicationDateRow = ({ paper }) => (
  <div className="row publication-date-row">
    <div className="col-12">
      Publication Date: {paper.get('publicationDateTime')}
    </div>
  </div>
);

const PaperMetadata = ({ paper, authors, isStarred }) => (
  <div className="metadata-row">
    <PaperTitleRow paper={paper} isStarred={isStarred}/>
    <PaperAuthorsRow authors={authors}/>
    <PaperPublicationDateRow paper={paper}/>
  </div>
);

const PaperSummary = ({ paper }) => (
  <div className="row summary-row">
    <div className="col-12">
      <p>{paper.get('summary')}</p>
    </div>
  </div>
);

class PaperItem extends React.PureComponent {
  shouldComponentUpdate(newProps, newState) {
    return (
      !_.isEqual(this.props, newProps) ||
      !_.isEqual(this.state, newState)
    );
  }

  render() {
    const { authors, isStarred, paper } = this.props;

    const divClassName = classNames({
      "paper-item": true,
      ...this.props.classNames,
    });

    return (
      <div className={divClassName} data-id={paper.get('id')}>
        <PaperMetadata paper={paper} authors={authors} isStarred={isStarred}/>
        <PaperSummary paper={paper}/>
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
