const express = require("express");
const bodyParser = require("body-parser");
const socket = require("socket.io");
const massive = require("massive");
require("dotenv").config();

const { SERVER_PORT, CONNECTION_PATH } = process.env;

const app = express();

app.use(bodyParser.json());

massive(CONNECTION_PATH).then(massiveInstance => {
  app.set("db", massiveInstance);
});

const io = socket(
  app.listen(SERVER_PORT, () =>
    console.log(`Magic happens on Port: ${SERVER_PORT}`)
  )
);

io.on("connection", socket => {
  socket.on("connect-room", data => {
    socket.join(data.room);
  });

  socket.on("join-room", data => {
    socket.join(data.room);

    io.sockets
      .in(data.room)
      .emit("joining-room", { name: data.name, avatar: data.avatar });
  });

  socket.on("disconnect", () => {
    console.log("disconnected :(");
  });
});

// to destroy a room and all clients in it
// io.sockets.clients(someRoom).forEach(function(s) {
//   s.leave(someRoom);
// });

// const db = app.get("db");
// db.check_rooms(data.room).then(response => {
//   console.log(response);
// });
