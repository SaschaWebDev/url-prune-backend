const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const server = express();

// MongoDB connection
mongoose.connect(
  process.env.DB_URL
    ? process.env.DB_URL
    : `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PW}@${process.env.DB_HOSTNAME}:${process.env.DB_PORT}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);

const db = mongoose.connection;
db.on(
  "error",
  console.error.bind(console, "Error establishing DB connection: ")
);
db.once("open", async () => {
  console.log(
    `%c Connection to MongoDB ${process.env.DB_NAME} successful!`,
    "color: #bada55"
  );
});

// Middlewares
server.use(express.json());
server.use(morgan("dev"));
server.use(helmet());
server.use(cors());

server.get("/", function welcome(req, res) {
  res.send(`Welcome to the ${process.env.ENVIRONMENT} API of url-pruning!`);
});

const urlRouter = require("./routes/url-router.js");
server.use("/v1/urls", urlRouter);

module.exports = server;
