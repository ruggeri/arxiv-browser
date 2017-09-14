import PaperItem from 'components/papers/shared/paper-item.jsx';
import PagerComponent from 'helpers/pager-component';
import { List } from 'immutable';
import React from 'react';

class PapersList extends PagerComponent {
  constructor(props) {
    super(props, {collectionName: 'papers', pageSize: 5, usePager: props.paginate});
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
