import React from 'react';

class PaperAuthorsList extends React.Component {
  render() {
    const { authors } = this.props;
    const authorItems = authors.map(a => <li>{author.name}</li>);

    return <ul>
      {authorItems}
    </ul>;
  }
}

class PaperItem extends React.Component {
  render() {
    const { paper } = this.props;
    return <li>{paper.get('title')}</li>;
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
    const { papers } = this.props;

    const paperItems = papers.valueSeq().map(
      paper => <PaperItem paper={paper} key={paper.get('link')}/>
    );

    return <div>
      <h1>There are {papers.size} papers in the archive!</h1>
      {paperItems}
    </div>;
  }
}

// Container
import { connect } from 'react-redux';
import { fetchPapers } from '../../actions/paper-actions';

export default connect(
  (state) => ({
    papers: state.papers,
  }),
  (dispatch) => ({
    fetchPapers: () => dispatch(fetchPapers()),
  }),
)(PapersList);
