import { container } from "./script.js";
import { body } from "./script.js";
class Node {
    constructor(value, actualNode) {
        this._parent = null;
        this._value = value;
        this._left = null;
        this._right = null;
        this._actualNode = actualNode; // actual node that show up on screen
        this.position = {
            x: 0,
            y: 0,
        };
    }

    get actualNode() {
        return this._actualNode;
    }

    get parent() {
        return this._parent;
    }

    set parent(parent) {
        this._parent = parent;
    }

    get val() {
        return this._value;
    }

    set val(val) {
        this._value = val;
    }

    set right(right) {
        this._right = right;
    }

    get right() {
        return this._right;
    }

    set left(left) {
        this._left = left;
    }

    get left() {
        return this._left;
    }

}

export class BinaryTree {
    disX = 30;
    disY = 7;
    constructor() {
        this._root = null;
        this.initialState = {
            backgroundColor: "var(--node-background)",
            border: "0.2em dashed var(--node-border)",
            color: "white",
        }
        this.visited = {
            backgroundColor: "var(--travel-node-background)",
            border: "0.2em solid var(--travel-node-border)",
            color: "var(--travel-node-text)",
        };
        this.fontInitialState = {
            color: "white",
            fontWeight: 400,
        }
        this.fontVisited = {
            color: "var(--travel-node-text)",
            fontWeight: "bold",
        };
        this.foundNode = {
            backgroundColor: "var(--found-node-background)",
            border: "0.2em solid var(--found-node-border)",
            color: "var(--found-node-text)",
        }
        this.foundNodeFont = {
            color: "var(--found-node-text)",
            fontWeight: "bold",
        }
    }

    get root() {
        return this._root;
    }

    isEmpty() {
        return this._root === null;
    }

    search(val, tl, but) {
        let visits = [];
        if (this.isEmpty())
            return null;
        let curNode = generateTravelNode("current");
        container.append(curNode);
        let current = this._root;
        let parent = current;
        let isLeft = false;
        let lv = 0;
        while (current) {
            parent = current;
            visits.push(current.actualNode);
            if (current.val == val) {
                break;
            }
            else if (current.val > val) {
                this.changeBackground(current, this.visited, this.fontVisited, tl);
                isLeft = true;
                current = current.left;
            }
            else {
                this.changeBackground(current, this.visited, this.fontVisited, tl);
                isLeft = false;
                current = current.right;
            }
            lv++;
            if (current) {
                this.createLineAnimation(parent, current, isLeft, tl);
                this.moveNode(curNode, current.position.x, current.position.y, tl);
            }
        }
        if (current) {
            this.changeBackground(current, this.foundNode, this.foundNodeFont, tl);
            this.changeBackGroundForChild(current, true, this.foundNode, tl, "<");
            this.changeBackGroundForChild(current, false, this.foundNode, tl, "<");
            this.makeNodeJump(current.actualNode, tl);
            this.removeTravelNode(curNode, tl, but);
        }
        else {
            this.moveTravelNodeToNull(parent, curNode, isLeft, lv, tl, but);
        }
        this.reverse(visits, tl);
    }

    makeNodeJump(curNode, tl) {
        tl.to(curNode, {
            keyframes: {
                y: [0, -20, 0],
            },
            duration: 2,
            ease: "bounce.out",
        });
    }
    reverse(visits, tl) {
        visits.forEach(visit => {
                tl.to([visit, visit.querySelector(".right"), visit.querySelector(".left")], this.initialState, "<")
                .to(visit.querySelector(".val"), this.fontInitialState, "<");
                let vtLines = visit.querySelectorAll(".virtual-line");
                if (vtLines) {
                    tl.to(vtLines, {
                        width: 0,
                        onComplete: () => {
                            vtLines.forEach(vtLine => {vtLine.remove();});
                        }
                    }, "<");
                }
            }
        );
    }

    removeTravelNode(curNode, tl, but) {
        tl.to(curNode, {
            y: 50,
            opacity: 0,
            onComplete: () => {
                curNode.remove();
                if (but) {
                    enable(but);
                }
            }
        }, "+=1");
    }
    
    changeBackground(current, style, fontStyle, tl, position) {
        tl.to(current.actualNode,  // make the current node change its background color to show that we have visited it 
                    style, position )
            .to(current.actualNode.querySelector(".val"), fontStyle // change it value's color also
                , "<");
    }

    changeBackGroundForChild(parent, isLeft, style, tl, position) {
        let refChild = isLeft ? parent.actualNode.querySelector(".left") : parent.actualNode.querySelector(".right");
        tl.to(refChild, {
            ...style,
        }, position);
    }

    moveNode(curNode, x, y, tl) {
        tl.to(curNode, {
            left: x + "rem",
            top: y + "rem",
        });
    }

    moveTravelNodeToNull(parent, curNode, isLeft, lv, tl, but) {
        let disTomove = parent.position.x + (isLeft ? - this.disX/lv : + this.disX/lv);
        tl.to(curNode, {
            left: disTomove + "rem",
            top: parent.position.y + this.disY + "rem",
            border: "none",
            backgroundColor: "var(--line-theme)",
            onComplete: () => {
                curNode.innerHTML = "null";
            }
        });
        this.removeTravelNode(curNode, tl, but);
    }

    createLineAnimation(parent, current, isLeft, tl) {
        let fontSize = parseInt(getComputedStyle(parent.actualNode).fontSize);
        let c1 = getCenterCoordinate(parent.actualNode);
        let c2 = getCenterCoordinate(current.actualNode);
        let distance = calculateDis(c1.cx, c1.cy, c2.cx, c2.cy);
        let angle = calculateAngle(c1.cx, c1.cy, c2.cx, c2.cy);
        let virtualLine = createLine(distance/fontSize);
        virtualLine.style.transform = `rotate(${angle}rad)`;
        if (isLeft) {
            virtualLine.classList.add("line-left");
        }
        else {
            virtualLine.classList.add("line-right");
        }
        parent.actualNode.append(virtualLine);
        this.changeBackGroundForChild(parent,isLeft, this.visited, tl);
        tl.fromTo(virtualLine, {width: 0}, {width: distance/fontSize + "rem"});
    }

    insert(val, tl, but) {
        let visits = [];
        let l;                   // this is the length for the connected line between each node (we will be back to it later)
        let connectedLine;      // the connected line (we make a reference to it so that we can create its animation later)
        let nod = createNode(val); // the actual node we need to show on the screen
        container.append(nod);     // append it to the container of the BST
        let node = new Node(val, nod);  // the node in the tree
        let lv = 0;          // we find the level so that we can divide the space for each node evenly and to prevent overlap between each node
        let isLeft = true;   // a variable to check if this node is insert in the left or in the right
        let current = this._root;   // traverse node
        let parent = this._root;    // the node that we need to insert the new node since current will go to null
        // In case the tree is emtpy
        let fs;
        if (this.isEmpty()) {       
            this._root = node;  // just simply put it to the root
            if (but)
                enable(but)
        }
        else {
            let curNode = generateTravelNode("current");  // the actual traverse node that will show up on the screen
            let parentNode = generateTravelNode("parent");  // the acutal parent node that will show up on the screen
            container.append(curNode);         // we append both of them into the container
            container.append(parentNode);
            tl.from([curNode, parentNode], {    // create the animation for both of these nodes 
                y: -50,
                opacity: 0,
            });
            while (current) {      // loop until current go to null
                visits.push(current.actualNode);
                this.changeBackground(current, this.visited, this.fontVisited, tl, "<");
                this.moveNode(parentNode, current.position.x, current.position.y, tl);
                parent = current;   // move the parent node to the current node
                if (val > current.val) {    
                    current = current.right; // we go right
                    isLeft = false; // make sure we change this variable so that we know which child we should insert to 
                }
                else {
                    current = current.left; // we go left
                    isLeft = true;  // make sure we change this variable so that we know which child we should insert to 
                }
                lv++;   // we go to the next level of the tree after this
                if (current) {  // if current is not null
                    this.createLineAnimation(parent, current,isLeft, tl);
                    this.moveNode(curNode, current.position.x, current.position.y, tl)
                }
                else {
                    this.changeBackGroundForChild(parent, isLeft, this.visited, tl, "+=0.2");
                    this.moveTravelNodeToNull(parent, curNode, isLeft, lv, tl);
                }
            }
            if (isLeft) {   // if we have to insert the node to the left of the tree
                parent.left = node; // insert the left child of parent to new node
                node.position.x = parent.position.x - this.disX/(lv);   // we find the new x position for the new node from its parent
                node.position.y = parent.position.y + this.disY;        // we find the new y position for the new node from its parent
            }
            else {          // if we have to insert the node to the right of the tree
                parent.right = node;
                node.position.x = parent.position.x + this.disX/(lv);// we find the new x position for the new node from its parent
                node.position.y = parent.position.y + this.disY;// we find the new y position for the new node from its parent
            }
            node.parent = parent;

        }
        nod.style.left = node.position.x + "rem";   // we make the actual node on screen have the exact position we've found
        nod.style.top = node.position.y + "rem";    // we make the actual node on screen have the exact position we've found
        // animation for the conncected line and new node when the node is inserted
        if (parent) {   
            let p = parent.actualNode;  // the actual parent node that show up on the screen
            let obj1 = p.getBoundingClientRect();   // the actual parent node's style object
            let obj2 = nod.getBoundingClientRect(); // the actual new node's style object
            let cx1 = obj1.left + obj1.width/2;     // we calculate the center's x coordinate of the parent node
            let cy1 = obj1.top + obj1.height/2;     // its center's y coordinate of the parent node
            let cx2 = obj2.left + obj2.width/2;     // the center's x coordinate of the actual new node
            let cy2 = obj2.top + obj2.height/2;     // the center's y coordinate of the actual new node
            let len = calculateDis(cx1, cy1, cx2, cy2);   // we calculate the distance between these two points
            let line = document.createElement("button");  // make the connected line
            connectedLine = line;          // reference it back to the one we created at the beginning
            l = len;            // make a copy of the len to the length we created at the beginning
            line.classList.add("line"); // add class to the line
            let angle = calculateAngle(cx1, cy1, cx2, cy2); // we calculate the angle between these two center points
            let fontSize = parseInt(getComputedStyle(p).fontSize);
            fs = fontSize;
            line.style.width = len/fontSize + "rem"; // add the width to the distance we've calculated
            if (isLeft) { // if this line is for the left child
                line.classList.add("line-left");    // add class left to it
                line.style.transform = `rotate(${angle}rad)`;
            }
            else { // if this line is for the right child
                line.classList.add("line-right");   // add class right to it
                line.style.transform = `rotate(${angle}rad)`;
            }
            p.append(line); // we add the line to the actual parent node
        }
        tl.from(nod, {  // animation for the actual node 
            y: 100,
            opacity: 0
        }).fromTo(connectedLine, {width: 0,}, {width: l/fs + "rem",}) // animation for the connected line
        .to(container.querySelector(".parent"), {
            y: -5 + "rem",
            opacity: 0,
            onComplete: () => {
                container.querySelector(".parent").remove();
                enable(but);
            }
        });
        this.reverse(visits, tl);
    }

    createLineUpAnimation(node, parent, tl) {
        let nod = node.actualNode;
        let p = parent.actualNode;
        let nodCenter = getCenterCoordinate(nod);
        let pCenter = getCenterCoordinate(p);
        let distance = calculateDis(nodCenter.cx, nodCenter.cy, pCenter.cx, pCenter.cy);
        let fontSize = parseInt(getComputedStyle(nod).fontSize);
        let line = document.createElement("button");
        line.style.width = distance/fontSize + "rem";
        let angle = calculateAngle(nodCenter.cx, nodCenter.cy, pCenter.cx, pCenter.cy);
        line.classList.add("virtual-line");
        line.classList.add("up");
        nod.append(line);
        if (parent.left === node)
            line.classList.add("line-right");
        else
            line.classList.add("line-left");
        line.style.transform = `rotate(${angle}rad)`
        tl.fromTo(line, {width: 0}, {width: distance/fontSize + "rem"});
    }

    async postOrder(node, tl, but) {
        let visits = [];
        await this.postOrderTravel(node, tl, visits);
        this.reverse(visits, tl);
        enable(but);
    }

    async postOrderTravel(node, tl, visits) {
        if (node) {
            visits.push(node.actualNode);
            this.changeBackground(node, this.visited, this.fontVisited, tl);
            if (node.left) {
                this.createLineAnimation(node, node.left, true, tl);
            }
            this.postOrderTravel(node.left, tl, visits);
            this.changeBackGroundForChild(node, true, this.foundNode, tl, "+=0.2");
            if (node.right) {
                this.createLineAnimation(node, node.right, false, tl);
            }
            this.postOrderTravel(node.right, tl, visits);
            this.changeBackGroundForChild(node, false, this.foundNode, tl, "+=0.2");
            this.changeBackground(node, this.foundNode, this.fontVisited, tl);
            let parent = node.parent;
            if (parent) {
                this.createLineUpAnimation(node, node.parent, tl);
            }
        }
    }
    async preOrder(node, tl, but) {
        let visits = [];
        await this.preOrderTravel(node, tl, visits);
        enable(but);
        this.reverse(visits, tl);
    }

    async preOrderTravel(node, tl, visits) {
        if (node) {
            this.changeBackground(node, this.foundNode, this.fontVisited, tl);
            visits.push(node.actualNode);
            if (node.left) {
                this.createLineAnimation(node, node.left, true, tl);
            }
            this.preOrder(node.left, tl, visits);
            this.changeBackGroundForChild(node, true, this.foundNode, tl, "+=0.2");
            if (node.right) {
                this.createLineAnimation(node, node.right, false, tl);
            }
            this.preOrder(node.right, tl, visits);
            this.changeBackGroundForChild(node, false, this.foundNode, tl, "+=0.2");
            let parent = node.parent;
            if (parent) {
                this.createLineUpAnimation(node, node.parent, tl);
            }
        }
    }
    async inOrder(node, tl, but) {
        let visits = [];
        await this.inOrderTravel(node, tl, visits);
        this.reverse(visits, tl);
        enable(but);
    }
    
    async inOrderTravel(node, tl, visits) {
        if (node) {
            this.changeBackground(node, this.visited, this.fontVisited, tl);
            if (node.left) {
                this.createLineAnimation(node, node.left, true, tl);
            }
            this.inOrder(node.left, tl);   // visit left
            //-----------------------------------------------
            // animation when finishing visit left
            this.changeBackGroundForChild(node, true, this.foundNode, tl, "+=0.2");
            // visit the node
            visits.push(node.actualNode);
            this.changeBackground(node, this.foundNode, this.foundNodeFont, tl);
            //-----------------------------------------------
            if (node.right) {       // visit right
                this.createLineAnimation(node, node.right, false, tl);
            }
            this.inOrder(node.right, tl);
            this.changeBackGroundForChild(node, false, this.foundNode, tl, "+=0.2");
            let parent = node.parent;
            if (parent) {
                this.createLineUpAnimation(node, parent, tl);
            }
        }
    }

}

function createNode(val) {
    let node = document.createElement("div");
    node.classList.add("node");
    node.innerHTML = `<p class = "val">${val}</p>
                     <div class = "child">
                        <button class = "left ref">Left</button>
                        <button class = "right ref">Right</button>
                    </div>
                    `;
    return node;
}

function calculateDis(x1, y1, x2, y2) {
    let x = (x1 - x2)**2;
    let y = (y1 - y2)**2;
    return Math.sqrt(x + y);
}

function calculateAngle(x1, y1, x2, y2) {
    let x = x1 - x2;
    let y = y1 - y2;
    let angle = Math.atan(y/x);
    return angle;
}

function generateTravelNode(name) {
    let node = document.createElement("button");
    node.innerHTML = name;
    node.classList.add("travel-node");
    node.classList.add(name);
    return node;
}

function getCenterCoordinate(node) {
    let obj = node.getBoundingClientRect();
    let x = obj.left;
    let y = obj.top;
    let width = obj.width;
    let height = obj.height;
    return {
        cx: x + width/2,
        cy: y + height/2,
    }
}

async function createDelayForTl(tl) {
    tl.addPause(0.5);
}


function generateCodeForInsert() {
    let code = document.createElement("div");
    code.classList.add("code");
    code.innerHTML = `<button class = "code-title">Implementation Code</button>
    <pre>
        <code>public void insert(int val) {</code>
                <code>1.  Node node = new Node(val);</code>
                <code>2.  if (this.isEmpty())</code>
                <code>3.        this.root = node;</code>
                <code>4.  else {</code>
                <code>5.        Node current = this.root;</code>
                <code>6.        Node parent = this.root;</code>
                <code>7.        boolean isLeft = false;</code>
                <code>8.        while (current != null) {</code>
                <code>9.            parent = current;</code>
                <code>10.           if (current.getVal() > val) {</code>
                <code>11.               current = current.getLeft();</code>
                <code>12.               isLeft = true;</code>
                <code>13.           }</code>
                <code>14.           else {</code>
                <code>15.               current = current.getRight();</code>
                <code>16.               isLeft = false;</code>
                <code>17.           }</code>
                <code>18.       }</code>
                <code>19.       if (isLeft)</code>
                <code>20.           parent.setLeft(node);</code>
                <code>21.       else</code>
                <code>22.           parent.setRight(node);</code>
                <code>23        }</code>
        <code>}</code>
    </pre>`;
    body.append(code);
}

function createLine(width) {
    let line = document.createElement("button");
    line.classList.add("virtual-line");
    line.style.width = width + "rem";
    return line;
}

function enable(element) {
    element.disabled = false;
}



