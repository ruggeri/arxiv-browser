// Helper classes that represent updates to a sequence.
export class InsertUpdate {
  constructor(index, item) {
    this.index = index;
    this.item = item;
  }

  apply(list) {
    return list.insert(this.index, this.item);
  }
}

export class MoveUpdate {
  constructor(fromIndex, toIndex) {
    this.fromIndex = fromIndex;
    this.toIndex = toIndex
  }

  apply(list) {
    const item = list.get(this.fromIndex);
    return list.delete(this.fromIndex).insert(this.toIndex, item);
  }
}

export class RemoveUpdate {
  constructor(index) {
    this.index = index;
  }

  apply(list) {
    return list.delete(this.index);
  }
}
