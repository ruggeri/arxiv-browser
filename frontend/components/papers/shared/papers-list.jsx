import PaperItem from 'components/papers/shared/paper-item.jsx';
import ResultsPager from 'helpers/results-pager';
import { List } from 'immutable';
import React from 'react';

class PapersList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {papers: List()};
    this.papersPager = new ResultsPager(5, pagedInPapers => {
      this.setState({papers: pagedInPapers })
    });
  }

  componentDidMount() {
    this.papersPager.pageIn(this.props.papers);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.papers.equals(this.props.papers)) {
      this.papersPager.pageIn(this.props.papers);
    }
  }

  render() {
    const { showAuthors } = this.props;
    const { papers } = this.state;

    const paperItems = papers.map(paper => (
      <li key={paper.get('id')}>
        <PaperItem paper={paper} showAuthors={showAuthors}/>
      </li>
    ));

    return (
      <ul>{paperItems}</ul>
    );
  }
}

export default PapersList;
