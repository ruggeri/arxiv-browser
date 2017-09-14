import PaperItem from 'components/papers/shared/paper-item.jsx';
import React from 'react';

class PapersList extends React.Component {
  render() {
    const { papers } = this.props;

    const paperItems = papers.map(paper => (
      <li key={paper.get('id')}>
        <PaperItem paper={paper}/>
      </li>
    ));

    return (
      <ul>{paperItems}</ul>
    );
  }
}

export default PapersList;
