const tools = require("./tools.js");
const process = require("process");
const webServer = require("./server.js");
const assert = require("assert");
const htmlParser = require("html-dom-parser");

async function test() {
    process.chdir("testdocs");
    const server = await webServer.boot(0);
    try {
        const {port} = server.address();
        const {status,
               message,
               headers,
               body} = await tools.getHttp(`http://localhost:${port}/docs`);

        // Parse the HTML returned
        const [{
            children: [
                head, {
                    children: [
                        h1,
                        div,
                        ul
                    ]
                }
            ]
        }] = htmlParser(body);

        assert(h1.children[0].data == "/docs", "the header was not /docs")
        assert(ul.attribs.class == "files", `the UL does not have a class of 'files'?`);

        const [{ 
            children: [
                test1FileA
            ]
        }] = ul.children;

        assert(
            test1FileA.attribs.href == "/docs/test1.md",
            `the link expected is not the markdown file: ${test1FileA.attribs.href}`
        );

        // Download the script
        const {status: statusScript,
               message: messageScript,
               headers: headersScript,
               body: bodyScript} = await tools.getHttp(`http://localhost:${port}/?script`);
        assert(bodyScript.startsWith("window.addEventListener"), bodyScript.substring(0, 30));
    }
    finally {
        server.close();
    }
}


test().then()

// End
