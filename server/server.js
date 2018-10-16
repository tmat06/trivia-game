const express = require("express");
const bodyParser = require("body-parser");
const socket = require("socket.io");
const massive = require("massive");
const axios = require("axios");
require("dotenv").config();

const { SERVER_PORT, CONNECTION_PATH } = process.env;

const app = express();

app.use(bodyParser.json());

app.use(express.static(`${__dirname}/../build`));

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

app.get("/room-check/:room", (req, res) => {
  let db = app.get("db");
  db.check_rooms(req.params.room).then(response => {
    if (response[0]) {
      //indicating that room is joinable
      res.status(200).send("true");
    } else {
      //indicating that room has not been made yet
      res.status(200).send("false");
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
        val.question = val.question.replace(/&lt;/gi, "<");
        val.question = val.question.replace(/&gt;/gi, ">");
        val.question = val.question.replace(/&le;/gi, "≤");
        val.question = val.question.replace(/&ge;/gi, "≥");
        val.question = val.question.replace(/&Agrave;/gi, "À");
        val.question = val.question.replace(/&Aacute;/gi, "Á");
        val.question = val.question.replace(/&Acirc;/gi, "Â");
        val.question = val.question.replace(/&Atilde;/gi, "Ã");
        val.question = val.question.replace(/&Auml;/gi, "Ä");
        val.question = val.question.replace(/&Aring;/gi, "Å");
        val.question = val.question.replace(/&agrave;/gi, "à");
        val.question = val.question.replace(/&aacute;/gi, "á");
        val.question = val.question.replace(/&acirc;/gi, "â");
        val.question = val.question.replace(/&atilde;/gi, "ã");
        val.question = val.question.replace(/&auml;/gi, "ä");
        val.question = val.question.replace(/&aring;/gi, "å");
        val.question = val.question.replace(/&AElig;/gi, "Æ");
        val.question = val.question.replace(/&aelig;/gi, "æ");
        val.question = val.question.replace(/&szlig;/gi, "ß");
        val.question = val.question.replace(/&Ccedil;/gi, "Ç");
        val.question = val.question.replace(/&ccedil;/gi, "ç");
        val.question = val.question.replace(/&Ntilde;/gi, "Ñ");
        val.question = val.question.replace(/&ntilde;/gi, "ñ");
        val.question = val.question.replace(/&#153;/gi, "™");
        val.question = val.question.replace(/&#131;/gi, "ƒ");
        val.question = val.question.replace(/&ouml;/gi, "ö");
        val.question = val.question.replace(/&shy;/gi, "");
        val.question = val.question.replace(/&oacute;/gi, "ó");

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
        val.correct_answer = val.correct_answer.replace(/&lt;/gi, "<");
        val.correct_answer = val.correct_answer.replace(/&gt;/gi, ">");
        val.correct_answer = val.correct_answer.replace(/&le;/gi, "≤");
        val.correct_answer = val.correct_answer.replace(/&ge;/gi, "≥");
        val.correct_answer = val.correct_answer.replace(/&Agrave;/gi, "À");
        val.correct_answer = val.correct_answer.replace(/&Aacute;/gi, "Á");
        val.correct_answer = val.correct_answer.replace(/&Acirc;/gi, "Â");
        val.correct_answer = val.correct_answer.replace(/&Atilde;/gi, "Ã");
        val.correct_answer = val.correct_answer.replace(/&Auml;/gi, "Ä");
        val.correct_answer = val.correct_answer.replace(/&Aring;/gi, "Å");
        val.correct_answer = val.correct_answer.replace(/&agrave;/gi, "à");
        val.correct_answer = val.correct_answer.replace(/&aacute;/gi, "á");
        val.correct_answer = val.correct_answer.replace(/&acirc;/gi, "â");
        val.correct_answer = val.correct_answer.replace(/&atilde;/gi, "ã");
        val.correct_answer = val.correct_answer.replace(/&auml;/gi, "ä");
        val.correct_answer = val.correct_answer.replace(/&aring;/gi, "å");
        val.correct_answer = val.correct_answer.replace(/&AElig;/gi, "Æ");
        val.correct_answer = val.correct_answer.replace(/&aelig;/gi, "æ");
        val.correct_answer = val.correct_answer.replace(/&szlig;/gi, "ß");
        val.correct_answer = val.correct_answer.replace(/&Ccedil;/gi, "Ç");
        val.correct_answer = val.correct_answer.replace(/&ccedil;/gi, "ç");
        val.correct_answer = val.correct_answer.replace(/&Ntilde;/gi, "Ñ");
        val.correct_answer = val.correct_answer.replace(/&ntilde;/gi, "ñ");
        val.correct_answer = val.correct_answer.replace(/&#153;/gi, "™");
        val.correct_answer = val.correct_answer.replace(/&#131;/gi, "ƒ");
        val.correct_answer = val.correct_answer.replace(/&ouml;/gi, "ö");
        val.correct_answer = val.correct_answer.replace(/&shy;/gi, "");
        val.correct_answer = val.correct_answer.replace(/&oacute;/gi, "ó");

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
          val = val.replace(/&lt;/gi, "<");
          val = val.replace(/&gt;/gi, ">");
          val = val.replace(/&le;/gi, "≤");
          val = val.replace(/&ge;/gi, "≥");
          val = val.replace(/&Agrave;/gi, "À");
          val = val.replace(/&Aacute;/gi, "Á");
          val = val.replace(/&Acirc;/gi, "Â");
          val = val.replace(/&Atilde;/gi, "Ã");
          val = val.replace(/&Auml;/gi, "Ä");
          val = val.replace(/&Aring;/gi, "Å");
          val = val.replace(/&agrave;/gi, "à");
          val = val.replace(/&aacute;/gi, "á");
          val = val.replace(/&acirc;/gi, "â");
          val = val.replace(/&atilde;/gi, "ã");
          val = val.replace(/&auml;/gi, "ä");
          val = val.replace(/&aring;/gi, "å");
          val = val.replace(/&AElig;/gi, "Æ");
          val = val.replace(/&aelig;/gi, "æ");
          val = val.replace(/&szlig;/gi, "ß");
          val = val.replace(/&Ccedil;/gi, "Ç");
          val = val.replace(/&ccedil;/gi, "ç");
          val = val.replace(/&Ntilde;/gi, "Ñ");
          val = val.replace(/&ntilde;/gi, "ñ");
          val = val.replace(/&#153;/gi, "™");
          val = val.replace(/&#131;/gi, "ƒ");
          val = val.replace(/&ouml;/gi, "ö");
          val = val.replace(/&shy;/gi, "");
          val = val.replace(/&oacute;/gi, "ó");

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
