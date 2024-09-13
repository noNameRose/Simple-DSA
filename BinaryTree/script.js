import { BinaryTree } from "./bTree.js";

const bars = document.querySelectorAll(".operations > .bar")
export const container = document.querySelector(".container");
export const body = document.body;
let tree = new BinaryTree();

for (let bar of bars) {
    const method = bar.firstElementChild;
    let tl = gsap.timeline({paused: true}).to(method, {
        x: "1em",
        opacity: 0.5,
    });
    method.onmouseenter = () => {
        tl.play();
    }
    method.onmouseleave = () => {
        tl.reverse();
    }
    method.onclick = () => {
        gsap.to(method.nextElementSibling, {
            opacity: 1,
        });
        document.querySelectorAll(".method").forEach(mt => {
            if (mt.classList.contains("picked")) {
                mt.classList.remove("picked");
                gsap.to(mt.nextElementSibling, {
                    opacity: 0,
                });
            }
        });
        method.classList.add("picked");
    }
    bar.querySelectorAll(".start").forEach(but => but.onclick = () => {
        but.disabled = true;
        let newTl = gsap.timeline();
        let methodName = bar.classList[0];
        if (methodName !== "traverse") {
            let input = bar.querySelector(".input").value;
            tree[methodName](+input, newTl, but);
        }
        else {
            methodName = but.classList[0];
            tree[methodName](tree.root, newTl, but);
        }
        
    });
}

