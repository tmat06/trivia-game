const express = require("express");
const bodyParser = require("body-parser");
const socket = require("socket.io");
const massive = require("massive");
const axios = require("axios");
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
});

app.get("/get-questions/:category", (req, res) => {
  axios
    .get(
      `https://opentdb.com/api.php?amount=10${
        req.params.category != -1 ? "&category=" + req.params.category : ""
      }`
    )
    .then(response => {
      //use RegEx here for questions and answers
      response.data.results.map((val, i) => {
        val.question = val.question.replace(/&#039;/gi, "'");
        val.question = val.question.replace(/&quot;/gi, '"');
        val.question = val.question.replace(/&uuml;/gi, "ü");
        val.question = val.question.replace(/&eacute;/gi, "é");
        val.question = val.question.replace(/&ldquo;/gi, "'");
        val.question = val.question.replace(/&rdquo;/gi, "'");
        val.question = val.question.replace(/&amp;/gi, "&");
        val.question = val.question.replace(/&ograve;/gi, "ò");
        val.question = val.question.replace(/&micro;/gi, "μ");
        val.question = val.question.replace(/&scaron;/gi, "š");
        val.question = val.question.replace(/&rsquo;/gi, "'");

        val.correct_answer = val.correct_answer.replace(/&#039;/gi, "'");
        val.correct_answer = val.correct_answer.replace(/&quot;/gi, '"');
        val.correct_answer = val.correct_answer.replace(/&uuml;/gi, "ü");
        val.correct_answer = val.correct_answer.replace(/&eacute;/gi, "é");
        val.correct_answer = val.correct_answer.replace(/&ldquo;/gi, "'");
        val.correct_answer = val.correct_answer.replace(/&rdquo;/gi, "'");
        val.correct_answer = val.correct_answer.replace(/&amp;/gi, "&");
        val.correct_answer = val.correct_answer.replace(/&ograve;/gi, "ò");
        val.correct_answer = val.correct_answer.replace(/&micro;/gi, "μ");
        val.correct_answer = val.correct_answer.replace(/&scaron;/gi, "š");
        val.correct_answer = val.correct_answer.replace(/&rsquo;/gi, "'");

        val.incorrect_answers = val.incorrect_answers.map((val, i) => {
          val = val.replace(/&#039;/gi, "'");
          val = val.replace(/&quot;/gi, '"');
          val = val.replace(/&uuml;/gi, "ü");
          val = val.replace(/&eacute;/gi, "é");
          val = val.replace(/&ldquo;/gi, "'");
          val = val.replace(/&rdquo;/gi, "'");
          val = val.replace(/&amp;/gi, "&");
          val = val.replace(/&ograve;/gi, "ò");
          val = val.replace(/&micro;/gi, "μ");
          val = val.replace(/&scaron;/gi, "š");
          val = val.replace(/&rsquo;/gi, "'");

          return val;
        });

        return val;
      });

      res.status(200).send(response.data);
    });
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

  socket.on("timer-start", data => {
    //Closure Method used to not overlap on other current timers
    timerCountdown(data.time, data.room);
  });

  //Closure Method called on for Timer
  function timerCountdown(time, room) {
    let tempTime = time;
    let timerCounter = setInterval(() => {
      io.sockets.in(room).emit("timer-countdown", tempTime);
      --tempTime;
    }, 1000);
    setTimeout(() => {
      clearInterval(timerCounter);
      io.sockets.in(room).emit("timer-finish", "finished");
    }, 7000);
  }

  socket.on("recieve-questions", data => {
    io.sockets.in(data.room).emit("questions", data.questions);
  });

  socket.on("update-tracker", data => {
    io.sockets.in(data.room).emit("tracker-update", data.tracker);
  });

  socket.on("scores", data => {
    io.sockets.in(data.room).emit("player-scores", data);
  });

  socket.on("rankings", data => {
    io.sockets.in(data.room).emit("player-rankings", data);
  });

  socket.on("leave-room", data => {
    socket.leave(data.room);
  });

  socket.on("disconnect", () => {
    console.log("disconnected :(");
  });
});
