import React from 'react';

class PaperAuthorsList extends React.Component {
  render() {
    const { authors } = this.props;
    const authorItems = authors.map(a => <li key={a.get('name')}>{a.get('name')}</li>);

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
    const { papers, authorsByPaperLinks } = this.props;

    const paperItems = papers.valueSeq().map(paper => {
      const authors = (
        authorsByPaperLinks.get(paper.get('link'))
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
import { authorsByPaperLinks } from '../../query';
import { fetchPapers } from '../../actions/paper-actions';

export default connect(
  (state) => ({
    papers: state.papers,
    authorsByPaperLinks: authorsByPaperLinks(state, state.papers),
  }),
  (dispatch) => ({
    fetchPapers: () => dispatch(fetchPapers()),
  }),
)(PapersList);
