export class Utilities {
  static stringArraysEqual(left: string[], right: string[]) {
    if (!left || !right || left.length !== right.length) {
      return false;
    }
    for (let i = 0; i < left.length; ++i) {
      if (left[i] !== right[i]) {
        return false;
      }
    }
    return true;
  }

  static updateArray<ItemType>(original: ItemType[], updated: ItemType[], itemsEqual: (left: ItemType, right: ItemType) => boolean) {

    if (!Array.isArray(original)) {
      throw new Error('Utilities.updateArray: Cannot update uninitialized array');
    }

    for (let i = 0; i < updated.length; ++i) {
      if (
        i >= original.length || !itemsEqual(updated[i], original[i])) {
        const toAppend = updated.slice(i);
        original.splice(i, original.length - i, ...toAppend);
        return;
      }
    }
  }

  static appendToArray<ItemType>(original: ItemType[], append: ItemType[], itemsEqual: (left: ItemType, right: ItemType) => boolean) {
    if (!Array.isArray(original)) {
      throw new Error('Utilities.appendToArray: Cannot append to uninitialized array');
    }

    const realAppend: ItemType[] = [];
    for (const appendItem of append) {
      if ( original.findIndex(item => {
        itemsEqual(item, appendItem)
      }) === -1) {
        realAppend.push(appendItem);
      }
    }
    original.splice(original.length, 0, ...realAppend);
  }

  static arraysEqual<ItemType>(left: ItemType[], right: ItemType[], itemsEqual: (left: ItemType, right: ItemType) => boolean) {
    if (!left || !right || left.length !== right.length) {
      return false;
    }
    for (let i = 0; i < left.length; ++i) {
      if (!itemsEqual(left[i], right[i])) {
        return false;
      }
    }
    return true;
  }
}
