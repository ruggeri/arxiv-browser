import { List } from 'immutable';
import React from 'react';

// Helper classes that represent updates to a sequence.
class RemoveUpdate {
  constructor(index) {
    this.index = index;
  }

  apply(list) {
    return list.delete(this.index);
  }
}

class InsertUpdate {
  constructor(index, item) {
    this.index = index;
    this.item = item;
  }

  apply(list) {
    return list.insert(this.index, this.item);
  }
}

class MoveUpdate {
  constructor(fromIndex, toIndex) {
    this.fromIndex = fromIndex;
    this.toIndex = toIndex
  }

  apply(list) {
    const item = list.get(this.fromIndex);
    return list.delete(this.fromIndex).insert(this.toIndex, item);
  }
}

// Applies a sequence of updates to transform a list of items.
function applyUpdateSequence(updateSequence, currentItems) {
  updateSequence.forEach(u => {
    if (!u.apply) {
      debugger
    }
    currentItems = u.apply(currentItems)
  });
  return currentItems;
}

// This builds a sequence of updates to transform, one-by-one,
// currentItems toward newItems.
//
// The algorithm is to iterate through both lists. If the currentItem
// should be removed, we remove it. Otherwise, if in the newItems lists
// an item should come before the currentItem, the new item should
// either (1) be inserted if it was not previously in the original list
// or (2) moved forward in the list if it does already exist.
//
// We repeat this, transforming currentItems one-by-one, and each time
// recording the change we made.
function buildUpdateSequence(currentItems, newItems) {
  let updateSequence = List();

  let currentItemsIndex = 0;
  let newItemsIndex = 0;
  while (currentItemsIndex < currentItems.count() || newItemsIndex < newItems.count()) {
    const firstCurrentItem = currentItems.get(currentItemsIndex);
    const firstNewItem = newItems.get(newItemsIndex);

    if (firstCurrentItem && !newItems.includes(firstCurrentItem)) {
      // If the current item should be removed, remove it.
      const removeUpdate = new RemoveUpdate(currentItemsIndex);
      updateSequence = updateSequence.push(removeUpdate);

      currentItems = removeUpdate.apply(currentItems);
    } else if (firstCurrentItem && firstCurrentItem.equals(firstNewItem)) {
      // If the current item is in the right place, leave it.
      currentItemsIndex += 1;
      newItemsIndex += 1;
    } else if (!currentItems.includes(firstNewItem)) {
      // Current item belongs here, but needs to have a new item
      // inserted before it.
      const insertUpdate = new InsertUpdate(
        currentItemsIndex,
        firstNewItem
      );
      updateSequence = updateSequence.push(insertUpdate);

      currentItems = insertUpdate.apply(currentItems);

      currentItemsIndex += 1;
      newItemsIndex += 1;
    } else if (currentItems.includes(firstNewItem)) {
      // Current item belongs here, but needs to have a subsequent
      // item moved ahead.
      const fromIndex = currentItems.indexOf(firstNewItem);
      const moveUpdate = new MoveUpdate(fromIndex, currentItemsIndex);
      updateSequence = updateSequence.push(moveUpdate);

      currentItems = moveUpdate.apply(currentItems);

      currentItemsIndex += 1;
      newItemsIndex += 1;
    } else {
      throw "Should never be here!";
    }
  }

  return updateSequence;
}

// `PageHelper#pageIn(currentItems, newItems)` first calculates updates
// that must be made to transform currentItems to newItems. It then
// performs these in chunks, each time calling `this.setCurrentItems`
// to let the user of the class update their state with the
// intermediate transformed list.
class PagerHelper {
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

// The Pager is a React Higher-Order component that "phases in" updates
// to a list of items. When `props.items` changes, the Pager
// incrementally updates `state.items` using the PagerHelper class.
// It is `state.items` that gets passed to the wrapped component.
//
// This helps because when a large number of items in a list changes,
// that can entail unmounting a lot of old item components and mounting
// a bunch of new ones. That can be very slow. And because that blocks
// the main thread, the user experiences lockup until React is done
// updating.
//
// The Pager HOC breaks this up into small incremental chunks of updates
// each of which should execute quickly and allow user interaction to
// interleave with the updates.
class Pager extends React.Component {
  constructor(props) {
    super(props);

    this.pager = new PagerHelper({
      pageSize: this.props.pageSize,
      setCurrentItems: currentItems => {
        this.setState({items: currentItems});
      },
    });

    this.state = {items: List()};
  }

  componentDidMount() {
    this.pager.pageIn(this.state.items, this.props.items);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.items.equals(this.props.items)) {
      this.pager.pageIn(this.state.items, nextProps.items);
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
