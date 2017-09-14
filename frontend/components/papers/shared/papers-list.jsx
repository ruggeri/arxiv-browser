import PaperItem from 'components/papers/shared/paper-item.jsx';
import { List } from 'immutable';
import React from 'react';

class PapersList extends React.PureComponent {
  shouldComponentUpdate(nextProps) {
    return !this.props.papers.equals(nextProps.papers);
  }

  render() {
    const { papers, showAuthors } = this.props;

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
