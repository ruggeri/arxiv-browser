import React from 'react';
import {PersistableSearchableAuthorsList} from 'components/authors/shared/searchable-authors-list.jsx';
import {ScrollRestorer} from 'helpers/component-state-store/scroll-restorer.jsx';

class AuthorsIndex extends React.PureComponent {
  render() {
    return (
      <div>
        <ScrollRestorer/>
        <PersistableSearchableAuthorsList kkey="papers" resultsLimit={20}/>
      </div>
    );
  }
}

export default AuthorsIndex;
