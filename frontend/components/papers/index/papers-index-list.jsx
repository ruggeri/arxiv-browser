import PaperStar from 'components/papers/shared/paper-star.jsx';
import PaperIndexItem from 'components/papers/index/paper-index-item.jsx';
import React from 'react';
import { connect } from 'react-redux';

class PapersIndexList extends React.Component {
  render() {
    const { papers } = this.props;

    const paperItems = papers.valueSeq().map(paper => {
      return (
        <li key={paper.get('link')}>
          <PaperIndexItem paper={paper}/>
        </li>
      );
    });

    return <ul>{paperItems}</ul>;
  }
}

export default PapersIndexList;
