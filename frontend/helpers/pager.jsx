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

class PagerHelper {
  constructor({pageSize, setCurrentItems}) {
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

      await this.delay(1);
    }
  }

  stopWorkers() {
    this.currentWorkerId += 1;
  }
}

class Pager extends React.PureComponent {
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
