import { List } from 'immutable';
import React from 'react';

import { List } from 'immutable';

class PagerHelper {
  constructor(pageIncrement, pagerCallback) {
    this.pageIncrement = pageIncrement;
    this.pagerCallback = pagerCallback;
    this.pagedInResults = List();

    this.currentWorkerId = 0;
  }

  delay(t) {
    return new Promise(resolve => setTimeout(resolve, t));
  }

  async pageIn(resultsToPage) {
    this.stopWorkers();
    const myWorkerId = this.currentWorkerId;

    while (!this.pagedInResults.equals(resultsToPage)) {
      if (myWorkerId != this.currentWorkerId) {
        // someone else will take over this work.
        return;
      }

      // This effectively adds one resultsToPage every 5ms. Note that
      // because we are using take every time, we can deal with
      // interruptions. If we've copied N items before we are
      // interrupted by a new call to pageIn, then the first thing
      // the new worker does is page in the first N+1 results.
      //
      // The only potential problem I can see is if the user is
      // interacting with an item, but then it gets pushed out of the
      // first N+1 results. That is unlikely and can never happen if
      // results are always appended, though.
      //
      // I'm kind of proud of this!
      this.pagedInResults = resultsToPage.take(
        this.pagedInResults.count() + this.pageIncrement
      );
      this.pagerCallback(this.pagedInResults)

      await this.delay(5);
    }
  }

  stopWorkers() {
    this.currentWorkerId += 1;
  }
}

class Pager extends React.PureComponent {
  constructor(props, pageSize) {
    super(props);

    this.pager = new ResultsPager(pageSize, pagedInResults => {
      this.setState({items: pagedInResults });
    });

    this.state = {items: List()};
  }

  componentDidMount() {
    this.pager.pageIn(this.props.items);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.items.equals(this.props.items)) {
      this.pager.pageIn(this.props.items);
    }
  }

  componentWillUnmount() {
    this.pager.stopWorkers();
  }

  render() {
    const Component = this.props.component;
    return <Component items={this.state.items}/>;
  }
}

export default Pager;
