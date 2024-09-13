const cards = document.querySelectorAll(".card");

cards.forEach(card => {
    let tl = gsap.timeline({paused: true}).to(card, {
        y: 0,
        x: 0,
        ease: "power4.out",
    });

    card.onpointerenter = () => {
        tl.play();
    };

    card.onpointerleave= () => {
        tl.reverse();
    }

    card.onclick = () => {
        let a = document.createElement("a");
        if (card.id === "ll") 
            a.href = "./SinglyLinkedlist/index.html";
        else if (card.id === "bst") 
            a.href = "./BinaryTree/index.html";
        a.click();
    }
})