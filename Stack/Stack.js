import {container} from "./script.js";
export class Stack {
    constructor() {
        this.storage = [];
    }

    isEmpty() {
        return this.storage.length == 0;
    }

    pop() {
        let top = container.firstChild;
        gsap.to(top, {
            y: -200,
            opacity: 0,
            onComplete: () => {
                if (top)
                    top.remove();
            }
        });
        if (this.isEmpty()) {
            throw new Error("The Stack is Empty");
        }
        return this.storage.pop();
    }

    push(val) {
        this.storage.push(val);
        let item = document.createElement("button");
        item.classList.add("item");
        item.innerHTML = `${val}`;
        item.addEventListener("mouseenter", function() {
            
        });
        container.prepend(item);
        gsap.from(item, {
            y: -1000,
            ease: "bounce",
            duration: 1,
        })
    }
}
