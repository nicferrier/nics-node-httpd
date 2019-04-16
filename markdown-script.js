/****
     Document TOC provider

     Maybe this should only be done when we have markdown class on the body?
****/


function insertAfter(newElement, reference) {
    // this is broken when we're the last element
    reference.nextElementSibling.parentElement.insertBefore(
        newElement,
        reference.nextElementSibling
    );
    return newElement;
}

window.addEventListener("load", loadEvt => {
    const h1 = document.querySelector("h1");
    if (h1 == null) {
        // No need for an index
        return;
    }

    // grab just the H2 - it would be great if we could descend into the H3 as well
    const h2 = Array.from(document.querySelectorAll("h2"));

    if (h2.length < 1) {
        // No need for an index here either.
        return;
    }

    const div = document.createElement("ul");
    div.classList.add("toc");

    const liList = h2.map(subtitle => {
        const a = document.createElement("li").appendChild(document.createElement("a"));
        a.setAttribute("href", "#" + subtitle.getAttribute("id"));
        a.textContent = subtitle.textContent;
        return a.parentElement;
    });

    liList.forEach(li => div.appendChild(li));

    // Insert after the H1
    insertAfter(div, h1);
});

// End
