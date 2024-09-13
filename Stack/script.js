import {Stack} from "./Stack.js";

let stack = new Stack();
export const container = document.querySelector(".stack");
const push = document.querySelector(".push");
const pop = document.querySelector(".pop");
push.onclick = function() {
    let num = prompt("Number?");
    stack.push(num);
};

pop.onclick = function() {
    stack.pop();
}