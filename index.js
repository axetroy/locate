const http = require("http");
const url = require("url");
const axios = require("axios");
const port = process.env.PORT || 3000;
const APP_KEY = process.env.APP_KEY || "";

// Creating new HTTP server.
http
  .createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);
    const ip =
      query.ip ||
      (req.headers["x-forwarded-for"] || "").split(",").shift() ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    if (pathname === "/favicon.ico") {
      res.writeHead(404);
      res.end();
      return;
    }

    console.log(`get location of ${ip}`);

    axios
      .get("http://api.map.baidu.com/location/ip", {
        params: {
          ak: query.ak || APP_KEY,
          ip
        }
      })
      .then(({ data }) => {
        const isSuccess = data && data.status === 0;
        res.writeHead(isSuccess ? 200 : 400, {
          "Content-Type": "application/json"
        });
        res.end(JSON.stringify(data));
      })
      .catch(({ response }) => {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end(JSON.stringify(response.data));
      });
  })
  .listen(port, () => {
    console.log("listen on port " + port);
  });
