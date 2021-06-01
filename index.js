require("dotenv").config();

const server = require("./server.js");

const host = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`\n URL-Pruning API is listening on http://${host}:${port}  \n`);
});
