const express = require("express");
const bodyParser = require("body-parser");
const socket = require("socket.io");
const massive = require("massive");
require("dotenv").config();

const { SERVER_PORT } = process.env;

const app = express();

app.use(bodyParser.json());

const io = socket(
  app.listen(SERVER_PORT, () =>
    console.log(`Magic happens on Port: ${SERVER_PORT}`)
  )
);

io.on("connection", socket => {
  console.log("connected");
  socket.on("create-room", data => {
    socket.join(data.room);
  });
});
