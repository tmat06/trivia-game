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

app.post("/create-room", (req, res) => {
  let db = app.get("db");
  db.check_rooms(req.body.room).then(response => {
    if (response[0]) {
      res.status(200).send("Room Already Created");
    } else {
      db.create_room(req.body.room).then(response => {
        res.sendStatus(200);
      });
    }
  });
  // req.body.room;
});

app.delete("/delete-room/:room", (req, res) => {
  //Runs when the host closes or leaves the game.
  let db = app.get("db");
  db.delete_room(req.params.room).then(response => {
    res.sendStatus(200);
  });
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
