export class Node {
    constructor(value, next = null) {
        this.value = value
        this.next = next
    }
}

export class LinkedList {

    constructor() {
        /**
         * @type Node
         */
        this.head = null
        this.tail = null
    }

    put(value) {
        // если пустой
        if(this.isEmpty()){
            this.head = this.tail = new Node(value)
        } else {
            если начало есть а хвост нулл
            this.tail.next = this.tail
            this.tail = new Node(value)
        }
    }

    pop(value) {

    }

    get head(){
        return this._head
    }

    set head(value){
        this._head = value
    }

    get tail(){
        return this._tail
    }

    set tail(value){
        this._tail =  value
    }

    isEmpty(){
        return this.head === null && this.tail === null
    }

    getNode(value) {
        let temp = this.head

        while (temp !== null) {
            if (temp.value === value) {
                return temp
            }

            temp = temp.next
        }

        return null
    }
}