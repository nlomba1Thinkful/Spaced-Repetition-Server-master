class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let tempNode = this.head;

      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }

  insertAt(item, pos) {
    let currNode = this.head;
    let previousNode = null;
    let counter = 1;
    if (!this.head) {
      return null;
    }
    if (pos <= 1) {
      return this.insertFirst(item);
    }
    while (currNode !== null && counter !== pos) {
      previousNode = currNode;
      currNode = currNode.next;
      counter++;
    }
    previousNode.next = new _Node(item, currNode);
  }

  find(item) {
    let currNode = this.head;
    if (!this.head) {
      return null;
    }
    while (currNode.value.original !== item) {
      if (currNode.next === null) {
        return null;
      } else {
        currNode = currNode.next;
      }
    }
    return currNode;
  }

  _findNthItem(pos) {
    let node = this.head;

    for (let i = 0; i < pos; i++) {
      node = node.next;
    }
    return node;
  }

  updateWordPosition(pos) {
    let head = this.head;
    this.head = this.head.next;
    this.insertAt(head.value, pos);
  }

  remove(item) {
    if (!this.head) {
      return null;
    }
    if (this.head.value.original === item) {
      this.head = this.head.next;
      return;
    }
    let currNode = this.head;
    let previousNode = this.head;

    while (currNode !== null && currNode.value.original !== item) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log('Item not found');
      return;
    }
    return (previousNode.next = currNode.next);
  }
}

module.exports = LinkedList;
