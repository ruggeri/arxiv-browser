import React from 'react';
import { Link } from 'react-router-dom';

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
      <ul>{authorItems}</ul>
    );
  }
}

class PaperItem extends React.Component {
  render() {
    const { paper, authors } = this.props;
    const url = `/papers/${paper.get('id')}`

    return (
      <div>
        <Link to={url}>{paper.get('title')}</Link>
        <PaperAuthorsList authors={authors}/>
      </div>
    );
  }
}

class PapersIndex extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchAllPapers();
  }

  render() {
    const { papers, authorsByPaperId } = this.props;

    const paperItems = papers.valueSeq().map(paper => {
      const authors = (
        authorsByPaperId.get(paper.get('id'))
      );

      return (
        <li key={paper.get('link')}>
          <PaperItem paper={paper} authors={authors}/>
        </li>
      );
    });

    return (
      <div>
        <h1>There are {papers.size} papers in the archive!</h1>
        <ul>{paperItems}</ul>
      </div>
    );
  }
}

// Container
import { connect } from 'react-redux';
import { authorsByPaperId } from '../../query';
import { fetchAllPapers } from '../../actions/paper-actions';

export default connect(
  (state) => ({
    papers: state.papers,
    authorsByPaperId: authorsByPaperId(state, state.papers),
  }),
  (dispatch) => ({
    fetchAllPapers: () => dispatch(fetchAllPapers()),
  }),
)(PapersIndex);
