const http = require("http");
const axios = require("axios");
const port = process.env.PORT || 3000;
const APP_KEY = process.env.APP_KEY || "";

// Creating new HTTP server.
http
  .createServer((req, res) => {
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",").pop() ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    axios
      .get("http://api.map.baidu.com/location/ip", {
        params: {
          ak: APP_KEY,
          ip
        }
      })
      .then(({ data }) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      })
      .catch(({ response }) => {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(JSON.stringify(response.data));
      });
  })
  .listen(port, () => {
    console.log("listen on port " + port);
  });
