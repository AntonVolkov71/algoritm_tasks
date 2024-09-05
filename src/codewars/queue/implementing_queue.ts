class Node {
    value: any
    next: Node
    prev: Node

    constructor(value: any, next: Node = null, prev:Node = null) {
        this.value = value
        this.next = next
        this.prev = prev
    }
}


export default class Queue {
    _size = 0

    // _queue = []
    constructor(private begin: Node = null, private tail: Node = null) {
    }

    enqueue = (item: any) => {
        if (this.begin === null) {
            this.begin = this.tail = new Node(item, null, null)
        } else {
            this.tail.next = new Node(item, null, this.tail)

            this.tail = this.tail.next
        }
        this._size++
    }
    dequeue = () => {
        if (this._size !== 0) {
            const item = this._queue.unshift()

            this._size--

            return item
        }
    }
    size = () => {
        return this._size
    }
}


