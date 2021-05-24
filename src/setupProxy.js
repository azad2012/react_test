const { createProxyMiddleware } = require("http-proxy-middleware");

const API_URL_LOC = "http://localhost:6006"; // local

// const PRE_FIXED_API = '/Service01';
const PRE_FIXED_API = ["/socket.io/wb"];

const API_URL =
  process.env.NODE_ENV === "production" ? API_URL_PRO : API_URL_LOC;
module.exports = function (app) {
  app.use(
    createProxyMiddleware(PRE_FIXED_API, {
      target: API_URL,
      ws: true,
    })
  );
};
