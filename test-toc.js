// Working out how to turn flat structure into tree stucture so I can do ToC

function E(name, value) {
    const thisValue = [];
    if (value !== undefined) {
        thisValue.push(value);
    }
    let textContent = thisValue.join("");
    return {
        tagName: name,
        children: thisValue,
        textContent: textContent,
        appendChild: function (newChild) {
            thisValue.push(newChild);
            textContent = thisValue.join("");
            return newChild;
        }
    };
}

const l=[
    E("h2", "hello"),
    E("h3", "one"),
    E("h3", "two"),
    E("h2", "bonjour"),
    E("h3", "une"),
    E("h3", "deux"),
    E("h3", "trois"),
    E("h2", "ni hao")
];

const topUl = E("ul");

const v = l.reduce(function (a,c) {
    console.log("c", c);
    console.log("a", a);
    console.log();
    const [prev, branch, ...rest] = a;

    if (branch.children.length < 1) {
        const newLeaf = E("li", c.textContent);
        branch.appendChild(newLeaf);
        return [c, branch].concat(rest);
    }

    // Go deeper case
    if (Number(c.tagName[1]) > Number(prev.tagName[1])) {
        const newBranch = E("ul");
        newBranch.appendChild(E("li", c.textContent));

        branch.appendChild(newBranch);
        return [c, newBranch, branch].concat(rest);
    }

    // Go backup case
    if (Number(c.tagName[1]) < Number(prev.tagName[1])) {
        const [branch, ...newRest] = rest;
        branch.appendChild(E("li", c.textContent));
        return [c, branch].concat(rest);
    }

    branch.appendChild(E("li", c.textContent));
    return [c, branch].concat(rest);
}, [undefined, topUl]);

console.log(JSON.stringify(v[1], null, 2));

// End

      
      
