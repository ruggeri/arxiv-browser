import { List } from 'immutable';

class ResultsPager {
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
    this.workerId += 1;
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
}

export default ResultsPager;
