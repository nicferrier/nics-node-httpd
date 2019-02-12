const http = require("http");

exports.getHttp = async function (url) {
    return await new Promise((resolve, reject) => {
        const request = http.request(
            url,
            function (response) {
                const status = response.statusCode;
                const headers = response.headers;
                const result = {
                    status: response.statusCode,
                    message: response.statusMessage,
                    headers: response.headers
                }
                const bodyChunks = [];
                if (status == 200) {
                    response.on("data", (d) => {
                        let string = new String(d);
                        bodyChunks.push(string);
                    });
                    response.on("end", function () {
                        result.body = bodyChunks.join("");
                        resolve(result);
                    });
                }
                else {
                    resolve(result);
                }
            }
        );
        request.end();
    });
}

// end
