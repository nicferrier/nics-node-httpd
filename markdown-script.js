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
    const heads = Array.from(document.querySelectorAll("h2,h3"));

    if (heads.length < 1) {
        // No need for an index here either.
        return;
    }

    const E = function (tagName, srcElement) {
        const e = document.createElement(tagName);
        if (srcElement !== undefined) {
            if (tagName == "li") {
                const srcId = srcElement.getAttribute("id");
                const a = e.appendChild(document.createElement("a"));
                a.textContent = srcElement.textContent;
                a.setAttribute("href", "#" + srcId);
            }
        }
        return e;
    }

    const topUl = E("ul");
    const v = heads.reduce(function (a,c) {
        console.log("c", c);
        console.log("a", a);
        console.log();
        const [prev, branch, ...rest] = a;

        if (branch.children.length < 1) {
            const newLeaf = E("li", c);
            branch.appendChild(newLeaf);
            return [c, branch].concat(rest);
        }

        // Go deeper case
        if (Number(c.tagName[1]) > Number(prev.tagName[1])) {
            const newBranch = E("ul");
            newBranch.appendChild(E("li", c));

            branch.appendChild(newBranch);
            return [c, newBranch, branch].concat(rest);
        }

        // Go backup case
        if (Number(c.tagName[1]) < Number(prev.tagName[1])) {
            const [branch, ...newRest] = rest;
            branch.appendChild(E("li", c));
            return [c, branch].concat(rest);
        }

        branch.appendChild(E("li", c));
        return [c, branch].concat(rest);
    }, [undefined, topUl]);

    topUl.classList.add("toc");
    insertAfter(topUl, h1);
});

// End
