import { LinkedList } from "./linkedList.js";

let methods = document.querySelectorAll(".method");
export const list = document.querySelector(".list");

let lst = new LinkedList();
methods.forEach(method => {
    let button = method.firstElementChild;
    let tl = gsap.timeline({paused: true}).to(button, {
        x: 1.5 + "rem",
        opacity: 0.5,
    } );
    button.addEventListener("pointerenter", () => {
        tl.play();
    })
    button.addEventListener("pointerleave", () => {
        tl.reverse();
    });
    button.onclick = () => {
        for (let mt of methods) {
            if (mt.classList.contains("picked")) {
                mt.classList.remove("picked");
                gsap.to(mt.lastElementChild, {
                    opacity: 0,
                })
            }
        }
        gsap.to(button.nextElementSibling, {
            opacity: 1,
        });
        method.classList.add("picked");
        let start = method.querySelector(".start");
        start.onclick = () => {
            // start.disabled = true;
            let methodName = method.classList[1];
            let val = +method.querySelector(".val-input").value;
            let index = +method.querySelector(".index-input").value;
            if (methodName !== "search") {
                lst[methodName](val, index, gsap.timeline(), start);
            }
            else {
                lst[methodName](val, gsap.timeline(), start);
            }
        }
    }
})

document.addEventListener("click", event => {
    console.log({x: event.clientX, y: event.clientY});
})