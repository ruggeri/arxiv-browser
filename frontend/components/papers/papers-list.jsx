import React from 'react';
import { Link } from 'react-router-dom';

class PaperAuthorItem extends React.Component {
  render() {
    const { author } = this.props;
    return (
      <li>
        <Link to={`/authors/${author.get('id')}`}>{author.get('name')}</Link>
      </li>
    );
  }
}

class PaperAuthorsList extends React.Component {
  render() {
    const { authors } = this.props;
    const authorItems = authors.map(
      a => <PaperAuthorItem key={a.get('name')} author={a}/>
    );

    return (
      <ul>{authorItems}</ul>
    );
  }
}

class PaperItem extends React.Component {
  render() {
    const { paper, authors } = this.props;
    return (
      <li>
        {paper.get('title')}
        <PaperAuthorsList authors={authors}/>
      </li>
    );
  }
}

class PapersList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchPapers();
  }

  render() {
    const { papers, authorsByPaperId } = this.props;

    const paperItems = papers.valueSeq().map(paper => {
      const authors = (
        authorsByPaperId.get(paper.get('id'))
      );

      return (
        <PaperItem paper={paper} authors={authors} key={paper.get('link')}/>
      );
    });

    return (
      <div>
        <h1>There are {papers.size} papers in the archive!</h1>
        {paperItems}
      </div>
    );
  }
}

// Container
import { connect } from 'react-redux';
import { authorsByPaperId } from '../../query';
import { fetchPapers } from '../../actions/paper-actions';

export default connect(
  (state) => ({
    papers: state.papers,
    authorsByPaperId: authorsByPaperId(state, state.papers),
  }),
  (dispatch) => ({
    fetchPapers: () => dispatch(fetchPapers()),
  }),
)(PapersList);
