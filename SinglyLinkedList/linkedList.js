import { Node } from "./node.js";
import { list } from "./script.js";

export class LinkedList {
    constructor() {
        this._head = null;
        this._tail = null;
        this._size = 0; 
        this.normal = {
            backgroundColor: "var(--node-theme)",
            border: "0.3em dashed var(--node-border-theme)",
        }
        this.normal_content = {
            backgroundColor: "var(--val-next-theme)",
            color: "var(--val-next-text)",
            fontWeight: "400",
        }
        this.visisted_state = {
            border: "0.4em solid var(--travel-node-border)",
            backgroundColor: "var(--travel-node-theme)",
        }
        this.content_visited_state = {
            backgroundColor: "var(--travel-node-border)",
            color: "var(--travel-node-text)",
            fontWeight: "bold",
        };
        this.visited_by_current = {
            backgroundColor: "var(--current-node-theme)",
            border: "0.4em solid var(--current-node-border)",
        };
        this.content_visited_state_current= {
            backgroundColor: "var(--current-node-border)",
            color: "var(--current-node-theme)",
            fontWeight: "bold",
        };
        this.gap = 5;
        this.gap_above_prev = 40;
        this.gap_above_current = 70;
        this.gap_above_newNode = 5;
    }

    isEmpty() {
        return this._head == null;
    }

    get head() {
        return this._head;
    }

    set head(head) {
        this._head = head;
    }

    get tail() {
        return this._tail;
    }

    set tail(tail) {
        this._tail = tail;
    }  
    
    get size() {
        return this._size;
    }

    
    insert(val, index) {
        let visitedNodes = [];
        let isFirstorLast = index === 0 || index === this.size;
        let tl = gsap.timeline();
        if (index > this.size || index < 0)
            return;
        let nod = createNode(val, index);
        let node = new Node(val, null, nod);
        let previous;
        let current;
        let prevNode;
        let curNode;
        let prevY;
        let curY;
        if (!isFirstorLast) {
            previous = this.head;
            current = this.head;
            prevNode = createTravelNode("previous");
            curNode = createTravelNode("current");
            if (current) {
                list.append(prevNode);
                list.append(curNode);
                tl.from([prevNode, curNode], {
                    x: "-3em",
                    opacity: 0,
                })
                let styleObj = current.actualNode.getBoundingClientRect();
                prevY = (styleObj.height + this.gap_above_prev) / findFontSize(current.actualNode);
                curY = (styleObj.height + prevNode.getBoundingClientRect().height + this.gap_above_current)/findFontSize(current.actualNode);
                curNode.style.top = curY + "rem";
                prevNode.style.top = prevY + "rem";
            }
            let i = 0;
            while (i < index) {
                visitedNodes.push(current.actualNode);
                if (curNode.querySelector(".visit-line").getBoundingClientRect().height > 0)
                    reduceLength(curNode.querySelector(".visit-line"), {height: 0}, tl);
                if (prevNode.querySelector(".visit-line").getBoundingClientRect().height > 0)
                    reduceLength(prevNode.querySelector(".visit-line"), {height: 0}, tl);
                moveNodeToRight(prevNode, current.position.x, tl);
                createVisitLineAnimation(current.actualNode, prevNode, tl);
                this.changeNodeBackGround(current.actualNode.querySelector(".node"), this.visisted_state, this.content_visited_state, tl);
                previous = current;
                current = current.next;
                if (current) {
                    reduceLength(curNode.querySelector(".visit-line"), {height: 0}, tl);
                    moveNodeToRight(curNode, current.position.x, tl);
                    createVisitLineAnimation(current.actualNode, curNode, tl);
                    this.changeNodeBackGround(current.actualNode.querySelector(".node"), this.visited_by_current, this.content_visited_state_current, tl);
                }
                i++;
                if (i == index) {
                    visitedNodes.push(current.actualNode);
                }
            }
        }
        if (index === 0 && !this.isEmpty()) {
            let nodes = collectNodes(this, index);
            nod.querySelector(".null").remove();
            moveListNodesRight(nodes, tl, this.gap);
            node.next = this.head;
            this.head = node;
            list.prepend(nod);
            let len = getLineWidth(node, this.gap);
            tl.from(nod, {
                y: "-5rem",
                opacity: 0,
            }).to(nod.querySelector(".line"), {
                width: len + "rem",
            })
        }
        else if (index === this.size) {
            if (this.isEmpty()) {   // if the list is empty
                this.head = node;
            }
            else {
                node.position.x = calculateNextPos(this.tail, this.gap);
                this.tail.next = node;
            }
            nod.style.left = node.position.x + "rem";
            nod.style.top = node.position.y + "rem";
            this.tail = node;
            list.append(nod);
            let len = getLineWidth(node, this.gap);
            let lastNode = nod.previousElementSibling;
            if (lastNode) { // animation for previous node if the list is not empty
                tl.to(lastNode.querySelector(".null"), {
                    y: "-3em",
                    opacity: 0,
                    onComplete: () => lastNode.querySelector(".null").remove()
                }).to(lastNode.querySelector(".line"), {
                    width: 0,
                })
            }
            // animation for the new node come in
            tl.from(nod, {
                y: "-5em",
                opacity: 0,
            });
            if (lastNode) {
                tl.to(lastNode.querySelector(".line"), {
                    width: len + "rem"
                });
            }
            tl.fromTo(nod.querySelector(".line"), {width: 0}, {width: getLineWidth(node, this.gap) + "rem"})
            .from(nod.querySelector(".null"), {
                x: "3em",
                opacity: 0,
            });
        }
        else {
            node.position.x = current.position.x;
            nod.querySelector(".null").remove();
            previous.actualNode.after(nod);
            let height = previous.actualNode.getBoundingClientRect().height/ findFontSize(nod);
            let prevHeight = prevNode.getBoundingClientRect().height / findFontSize(prevNode);
            let ttHeight = height + prevHeight + this.gap_above_newNode;
            nod.style.top = ttHeight + "rem";
            nod.style.left = node.position.x + "rem";
            let nodes = collectNodes(this, index);
            moveListNodesRight(nodes, tl, this.gap, 1);
            let dis = calculateDisToMove(node, this.gap);
            let len = (dis * 2) - node.actualNode.querySelector(".next").getBoundingClientRect().width/findFontSize(node.actualNode);
            tl.to(previous.actualNode.querySelector(".line"), {
                width: len + "rem",
                duration: 1,
            }, "<")
            .to(curNode, {
                left: current.position.x + "rem",
                duration: 1,
            }, "<");
            tl.from(nod, {
                opacity: 0,
                y: "3em",
                onComplete: () => {
                    let fs = findFontSize(nod);
                    let nodX = curNode.getBoundingClientRect().left;
                    let nodY = curNode.getBoundingClientRect().bottom;
                    let rightEndNext = rightEndCoorNext(nod.querySelector(".next"));
                    let line = calculateDistance(nodX, nodY, rightEndNext.x, rightEndNext.y) / fs;
                    let angle = calculateAngle(nodX, nodY, rightEndNext.x, rightEndNext.y);
                    let connectedLine = document.createElement("div");
                    connectedLine.style.transform = `rotate(-${angle}rad)`;
                    connectedLine.classList.add("line-newNode-current");
                    connectedLine.classList.add("temporary-line");
                    curNode.append(connectedLine);
                    tl.to(connectedLine, {
                        width: line + 0.5 + "rem",
                    });
                    reduceLength(previous.actualNode.querySelector(".line"), {width: 0}, tl);
                    let prevRightEndNext = rightEndCoorNext(previous.actualNode.querySelector(".next"));
                    let disMove = calculateDisToMove(previous, this.gap) * fs;
                    prevRightEndNext.x += disMove;
                    let len = calculateDistance(prevRightEndNext.x, prevRightEndNext.y, nodX, nodY)/ fs;
                    let ang = calculateAngle(prevRightEndNext.x, prevRightEndNext.y, nodX, nodY);
                    tl.to(connectedLine, {
                        width: len  + "rem",
                        rotate: `${ang-0.032}rad`,
                        duration: 2,
                    }).to(nod, {
                        top: 0,
                        duration: 2,
                    }, "<").to(previous.actualNode.querySelector(".line"), {
                        width: getLineWidth(previous, this.gap) + "rem",
                    }).to(connectedLine, {width: 0})
                    .to(nod.querySelector(".line"), {
                        width: getLineWidth(previous, this.gap) + "rem",
                    });
                    makeTravelNodeDisapear(curNode, tl);
                    makeTravelNodeDisapear(prevNode, tl, "<");
                    if (visitedNodes.length > 0) {
                        reverse(visitedNodes, this.normal, this.normal_content, tl, "<");
                    }
                }
            });
            node.next = current;
            previous.next = node;
        }
        this._size++;
    }

    changeNodeBackGround(node, style1, style2, tl) {
        tl.to(node, style1).to([node.querySelector(".next"), node.querySelector(".val")], style2, "<");
    }
}

function createNode(val, index) {
    let node = document.createElement("div");
    node.classList.add("container");
    node.innerHTML = `
                        <p class = "index">${index}</p>
                        <div class = "node">
                            <button class = "val">${val}</button>
                            <button class = "next">
                                Next
                                <div class = "line">
                                    <div class = "null">Null</div>
                                </div>
                            </button>
                        </div>
                    `;
    return node;
}

function createTravelNode(name) {
    let ele = document.createElement("button");
    ele.innerHTML = `${name}
                    <div class = "temporary-line visit-line"></div>
    `;

    ele.classList.add("travel");
    ele.classList.add(name);
    return ele;
}

function findFontSize(node) {
    return parseInt(getComputedStyle(node).fontSize);
}

function moveNodeToRight(node, x, tl, posParameter, incrementFunc, duration) {
    let dur = 0.5;
    if (duration)
        dur = duration;
    tl.to(node, {
        left: x + "rem",
        duration: dur,
        onComplete: () => {
            if (incrementFunc)
                incrementFunc(node, 1);
        }
    }, posParameter);
}

function moveListNodesRight(nodes, tl, gap, duration) {
    let n = nodes.length;
    nodes.forEach((node, i) => {
        if (i < n - 1) {
            let nextNode = nodes[i + 1];
            node.position.x = nextNode.position.x;
            moveNodeToRight(node.actualNode, node.position.x, tl, "<", changeIndex, duration);
        }
        else {
            let styleObj = node.actualNode.getBoundingClientRect();
            let width = styleObj.width/findFontSize(node.actualNode);
            node.position.x += width + gap;
            moveNodeToRight(node.actualNode, node.position.x, tl, "<", changeIndex, duration);
        }
    });
}

function collectNodes(list, startIndex) {
    if (startIndex >= list.size)
        return;
    let collectors = [];
    let current = list.head;
    let i = 0;
    while (current) {
        if (i >= startIndex)
            collectors.push(current);
        current = current.next;
        i++;
    }
    return collectors;
}

function changeIndex(node, amount) {
    let curInd = +node.querySelector(".index").innerHTML;
    node.querySelector(".index").innerHTML = curInd + amount;
}

function calculateNextPos(node, gap) {
    return (node.position.x  + calculateDisToMove(node, gap));
}

function calculateDisToMove(node, gap) {
    return (node.actualNode.getBoundingClientRect().width/findFontSize(node.actualNode)) + gap;
}

function getLineWidth(node, gap) {
    let width = node.actualNode.querySelector(".next").getBoundingClientRect().width/findFontSize(node.actualNode);
    return calculateDisToMove(node, gap) - width;
}

function calculateDistance(x1, y1, x2, y2) {   
    let x = (x1 - x2)**2;
    let y = (y1 - y2)**2;
    return Math.sqrt(x + y);
}

function rightEndCoorNext(next) {
    let styleObj = next.getBoundingClientRect();
    let x = styleObj.right;
    let y = (styleObj.top + styleObj.height/2);
    return {x: x, y: y};
}


function calculateAngle(x1, y1, x2, y2) {
    let y = Math.abs(y1 - y2);
    let x = Math.abs(x1 - x2);
    return Math.atan(y/x);
}

function createVisitLineAnimation(aboveNode, belowNode, tl) {
    let y1 = aboveNode.getBoundingClientRect().bottom;
    let y2 = belowNode.getBoundingClientRect().top;
    let dis = (y2 - y1)/findFontSize(aboveNode);
    tl.to(belowNode.querySelector(".visit-line"), {
        height: dis + "rem",
    });
}

function reduceLength(node, lengObj, tl) {
    tl.to(node, lengObj);
}

function makeTravelNodeDisapear(node, tl, posParameter) {
    let lines = node.querySelectorAll(".temporary-line");
    tl.to(lines, {
        width: 0,
    }, posParameter).to(node, {
        y: "2em",
        opacity: 0,
        onComplete: () => node.remove()
    }, posParameter)
}

function reverse(visitedNodes, nodeStyle, fontSytle, tl, posParameter) {
    visitedNodes.forEach(visitedNode => {
        tl.to(visitedNode.querySelector(".node"), nodeStyle, posParameter).to(visitedNode.querySelector(".node").children, fontSytle, posParameter);
    })
}