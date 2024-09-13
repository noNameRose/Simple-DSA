export class Node {
    constructor(val, next, actualNode) {
        this._val = val;
        if (next)
            this._next = next;
        this._next = null;
        this.position = {
            x: 0,
            y: 0,
        }
        this._actualNode = actualNode;
    }

    // get position() {
    //     return this.position;
    // }

    // set position(pos) {
    //     this.position = pos;
    // }

    get next() {
        return this._next;
    }

    set next(next) {
        this._next = next;
    }

    get actualNode() {
        return this._actualNode;
    }

    set actualNode(actualNode) {
        this._actualNode = actualNode;
    }
}