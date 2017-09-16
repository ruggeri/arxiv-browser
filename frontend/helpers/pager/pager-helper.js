import { applyUpdateSequence, buildUpdateSequence } from './build-update-sequence';

// `PageHelper#pageIn(currentItems, newItems)` first calculates updates
// that must be made to transform currentItems to newItems. It then
// performs these in chunks, each time calling `this.setCurrentItems`
// to let the user of the class update their state with the
// intermediate transformed list.
export class PagerHelper {
  static delayTime = 1;

  constructor({pageSize, setCurrentItems}) {
    // TODO: pageSize is probably not the correct approach. We probably
    // want a time-limit, and perform as many or as few updates as we
    // can in that limited time.
    if (!(pageSize > 0)) {
      throw `Why is pageSize ${JSON.stringify(pageSize)}?`
    }

    this.currentWorkerId = 0;
    this.pageSize = pageSize;
    this.setCurrentItems = setCurrentItems;
  }

  delay(t) {
    return new Promise(resolve => setTimeout(resolve, t));
  }

  async pageIn(currentItems, newItems) {
    this.stopWorkers();
    const myWorkerId = this.currentWorkerId;

    // Build the update sequence once, then slowly perform these
    // updates in batches of the pageSize.
    let updateSequence = buildUpdateSequence(currentItems, newItems);
    while (!updateSequence.isEmpty()) {
      if (myWorkerId != this.currentWorkerId) {
        // We've been pre-empted!
        return;
      }

      const updateBatch = updateSequence.take(this.pageSize);
      currentItems = applyUpdateSequence(updateBatch, currentItems);
      this.setCurrentItems(currentItems);
      updateSequence = updateSequence.skip(this.pageSize);

      await this.delay(PagerHelper.delayTime);
    }
  }

  stopWorkers() {
    this.currentWorkerId += 1;
  }
}
