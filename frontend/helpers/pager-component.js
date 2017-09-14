import ResultsPager from 'helpers/results-pager';
import { List } from 'immutable';
import React from 'react';

class DummyPager {
  constructor(pageSize, pagerCallback) {
    this.pagerCallback = pagerCallback;
  }

  pageIn(resultsToPage) {
    this.pagerCallback(resultsToPage);
  }

  stopWorkers() {
    // do nothing
  }
}

// TODO: It would be better to write this as a HOC than as a new class
// to extend. I should do that someday...
class PagerComponent extends React.PureComponent {
  constructor(props, {collectionName, pageSize, usePager}) {
    super(props);

    let pagerClazz;
    if (usePager) {
      pagerClazz = ResultsPager;
    } else {
      pagerClazz = DummyPager;
    }

    this._pagerAttributes = {
      collectionName: collectionName,
      pager: new pagerClazz(pageSize, pagedInResults => {
        this.setState({[collectionName]: pagedInResults })
      }),
    };
    this.state = {[collectionName]: List()};
  }

  componentDidMount() {
    const {collectionName, pager} = this._pagerAttributes;
    pager.pageIn(this.props[collectionName]);
  }

  componentDidUpdate(prevProps) {
    const {collectionName, pager} = this._pagerAttributes;
    const shouldRestart = !prevProps[collectionName].equals(
      this.props[collectionName]
    )
    if (shouldRestart) {
      pager.pageIn(this.props[collectionName]);
    }
  }

  componentWillUnmount() {
    const {pager} = this._pagerAttributes;
    pager.stopWorkers();
  }
}

export default PagerComponent;
