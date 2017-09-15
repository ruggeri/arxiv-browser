import { List } from 'immutable';
import React from 'react';

class PagerHelper {
  constructor(pageSize, pagerCallback) {
    if (!(pageSize > 0)) {
      throw `Why is pageSize ${JSON.stringify(pageSize)}?`
    }

    this.pageSize = pageSize;
    this.pagerCallback = pagerCallback;
    this.currentWorkerId = 0;
  }

  delay(t) {
    return new Promise(resolve => setTimeout(resolve, t));
  }

  async pageIn(resultsToPage) {
    this.stopWorkers();
    const myWorkerId = this.currentWorkerId;

    let pagedInResults = List();
    // Clear out any pre-existing results.
    this.pagerCallback(pagedInResults);
    while (!pagedInResults.equals(resultsToPage)) {
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
      pagedInResults = resultsToPage.take(
        pagedInResults.count() + this.pageSize
      );
      this.pagerCallback(pagedInResults)

      await this.delay(5);
    }
  }

  stopWorkers() {
    this.currentWorkerId += 1;
  }
}

class Pager extends React.PureComponent {
  constructor(props) {
    super(props);

    this.pager = new PagerHelper(this.props.pageSize, pagedInResults => {
      this.setState({items: pagedInResults});
    });

    this.state = {items: List()};
  }

  componentDidMount() {
    this.pager.pageIn(this.props.items);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.items.equals(this.props.items)) {
      this.pager.pageIn(nextProps.items);
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
