#!/usr/bin/env node
const http = require("http");
const fs = require("fs");
const process = require("process");
const path = require("path");
const stream = require("stream");
const marked = require("marked");
const tools = require("./tools.js");

exports.boot = async function (port) {
    const localdServer = http.createServer(async (request, response) => {
        if (request.url.endsWith("?script") || request.url.endsWith("?style")) {
            response.statusCode = 200;
            if (request.url.endsWith("?script")) {
                response.setHeader("content-type", "application/javascript");
                const scriptFile = path.join(__dirname, "script.js");
                return fs.createReadStream(scriptFile).pipe(response);
            }
            response.setHeader("content-type", "text/css");
            const cssFile = path.join(__dirname, "style.css");
            return fs.createReadStream(cssFile).pipe(response);
        }

        const pathInfo = request.url;

        const requestPath = pathInfo == "/" ? "" : pathInfo.substring(1);
        const cwd = process.cwd();
        const discPath = path.resolve(cwd, requestPath);
        const [accessError, haveAccess]
              = await fs.promises.access(discPath, fs.constants.R_OK)
              .then(r => [undefined, true])
              .catch(e => [e, false]);

        if (discPath.length < cwd.length || !haveAccess) {
            response.statusCode = 403;
            return response.end();
        }

        const fsThing = await fs.promises.lstat(discPath);
        if (fsThing.isDirectory()) {
            const files = await fs.promises.readdir(discPath);
            response.statusCode = 200;
            response.setHeader("content-type", "text/html; charset=utf-8");
            response.write(`<html><head><title>${discPath}</title>`);
            response.write("<link rel='shortcut icon' href='data:image/x-icon;,' type='image/x-icon'>");
            response.write("<link rel='stylesheet' href='?style' type='text/css'>");
            response.write("<script src='?script'></script>");
            response.write(`</head><body><h1>${pathInfo}</h1><div class='view'></div><ul class='files'>`);
            const linkLinks = files.map(file => {
                return {
                    file: file,
                    base: path.basename(file),
                    link: path.join(pathInfo, path.basename(file))
                }
            });
            linkLinks.forEach(link => response.write(`<li><a href='${link.link}'>${link.base}</li>`));
            return response.end("</ul></body></html>");
        }

        const extension = path.extname(discPath);
        const mimeTypeMap = {
            ".jpg": ["image", "jpeg"],
            ".png": ["image", "png"],
            ".gif": ["image", "gif"],
            ".txt": ["text", "plain"],
            ".html": ["text", "html"],
            ".htm": ["text", "html"],
            ".md": ["text", "html"]
        };
        const mimeType = mimeTypeMap[extension];
        const [mimeTypePrimary, mimeTypeSub] = mimeType;
        if (mimeTypePrimary == "image") {
            const mt = mimeTypePrimary + "/" + mimeTypeSub;
            response.setHeader("content-type", mt);
            return fs.createReadStream(discPath).pipe(response);
        }
        if (extension == ".md") {
            const raw = await fs.promises.readFile(discPath);
            const src = new String(raw);
            const md = marked(src.toString());
            response.write("<html><head>");
            response.write("<link rel='stylesheet' type='text/css' href='?style'/>");
            response.write("</head><body class='markdown'>");
            return response.end(md);
        }

        response.statusCode = 204;
        response.end();
    });
    const listener = await new Promise((resolve, reject) => {
        const listener = localdServer.listen(port, function () {
            resolve(listener);
        });
    });
    return listener;
}




if (require.main === module) {
    try {
        const args = process.argv.slice(2);
        if (args[0] == "help") {
            console.log(`nic's node httpd - a local webserver for local people

Start nic's httpd with port 8091 in the current directory:

   httpd 8091

If you don't specify a port, one will get allocated.

When nic's httpd starts it states what port it will be serving.`);
        }
        else {
            try {
                const firstArg = args.length > 0 ? args[0] : "0";
                const port = parseInt(firstArg);
                exports.boot(port)
                    .then(listener => {
                        console.log("listening on", listener.address().port);
                    });;
            }
            catch (e) {
                console.log(`${args[0]} is not an integer so won't start an httpd`);
            }
        }
    }
    catch (e) {
        console.log("args is empty?", e);
    }
}

// End
