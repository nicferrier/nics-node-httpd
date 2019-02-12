const tools = require("./tools.js");
const process = require("process");
const webServer = require("./server.js");

async function test() {
    process.chdir("testdocs");
    const server = await webServer.boot(8081);
    const {port} = server.address();
    const {status,
           message,
           headers,
           body} = await tools.getHttp(`http://localhost:${port}/docs`);
    console.log(status, message, headers, body);

    // Download the script
    const {status: statusScript,
           message: messageScript,
           headers: headersScript,
           body: bodyScript} = await tools.getHttp(`http://localhost:${port}/__viewer`);
    console.log(statusScript, messageScript, headersScript, bodyScript);

    server.close();
}


test().then()

// End
