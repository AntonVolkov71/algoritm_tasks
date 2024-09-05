import {LinkedList, Node} from "../linked_list/linked_list.js";

export class HashTable {

    constructor(pow, mod) {
        this._pow = pow
        this._mod = mod

        /**
         *
         * @type {LinkedList[]}
         */
        this._dict = []
    }

    add(value) {
        const [elem, key] = this._getElem(value)

        if (elem) {
            const findEl = elem.getNode(value)

            if (findEl !== null) {
                elem.put(value)
            }
        } else {
            this._dict[key] = new LinkedList(new Node(value))
        }
    }

    pop(value) {
        const [elem, key] = this._getElem(value)

        if (!elem) {
            return
        }

        elem.pop(value)

        if(elem.isEmpty()){
            this._dict[key] = undefined
        }
    }

    /**
     *
     * @param value
     * @return{[LinkedList, number] | undefined}
     */
    _getElem(value) {
        const key = this._getIndexKey(value)
        return [this._dict[key], key]
    }

    _createHash(value) {
        let hash = ''

        for (let i = 0; i < value; i++) {
            hash = (hash ** i + (hash % this._pow)) % this._mod
        }

        return hash
    }

    _getIndexKey(value) {
        return this._createHash(value) % this._mod
    }
}


