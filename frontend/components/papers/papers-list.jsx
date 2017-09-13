import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { authorsForPaperId } from '../../query';
import PaperStar from './paper-star.jsx';

class PaperAuthorItem extends React.Component {
  render() {
    const { author } = this.props;
    const url = `/authors/${author.get('id')}`;
    return <Link to={url}>{author.get('name')}</Link>;
  }
}

class PaperAuthorsList extends React.Component {
  render() {
    const { authors } = this.props;
    const authorItems = authors.map(a => (
      <li key={a.get('name')}>
        <PaperAuthorItem author={a}/>
      </li>
    ));

    return (
      <ul className="paper-author-list">{authorItems}</ul>
    );
  }
}

class PaperItem extends React.Component {
  render() {
    const { authors, paper, paperStatus } = this.props;
    const url = `/papers/${paper.get('id')}`

    return (
      <div>
        <Link to={url}>{paper.get('title')}</Link> <PaperStar paperStatus={paperStatus}/>
        <PaperAuthorsList authors={authors}/>
      </div>
    );
  }
}

PaperItem = connect(
  (state, ownProps) => {
    const paperId = ownProps.paper.get('id');

    return {
      authors: authorsForPaperId(state, paperId),
      paperStatus: state.paperStatuses.get(paperId),
    };
  }
)(PaperItem);

class PapersList extends React.Component {
  render() {
    const { papers } = this.props;

    const paperItems = papers.valueSeq().map(paper => {
      return (
        <li key={paper.get('link')}>
          <PaperItem paper={paper}/>
        </li>
      );
    });

    return <ul>{paperItems}</ul>;
  }
}

export default PapersList;