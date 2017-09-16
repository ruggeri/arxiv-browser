import { List } from 'immutable';
import { InsertUpdate, MoveUpdate, RemoveUpdate } from './updates';

// Applies a sequence of updates to transform a list of items.
export function applyUpdateSequence(updateSequence, currentItems) {
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
export function buildUpdateSequence(currentItems, newItems) {
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
