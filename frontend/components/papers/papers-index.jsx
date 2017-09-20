import React from 'react';
import {PersistableSearchablePapersList} from 'components/papers/shared/searchable-papers-list.jsx';
import {ScrollRestorer} from 'helpers/component-state-store/scroll-restorer.jsx';

class PapersIndex extends React.PureComponent {
  render() {
    const { papers } = this.props;

    return (
      <div>
        <ScrollRestorer/>
        <PersistableSearchablePapersList kkey="papers" resultsLimit={20}/>
      </div>
    );
  }
}

export default PapersIndex;
