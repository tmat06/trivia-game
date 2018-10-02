import React from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import { Motion, spring } from "react-motion";
import Button from "@material-ui/core/Button";
import _ from "lodash";

const socket = io.connect(
  "http://localhost:3006/",
  {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 99999
  }
);

class Round1Questions extends React.Component {
  constructor() {
    super();
    this.state = {
      tracker: 0,
      timer: 5,
      flip: true,
      flip2: false,
      answers: [],
      correctAnswer: "",
      points: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      canAnswer: true,
      chosenAnswer: ""
    };
    socket.on("tracker-update", tracker => {
      if (tracker === -1) {
        socket.emit("scores", {
          room: this.props.room,
          points: this.state.points,
          character: this.props.character
        });
        this.props.history.push("/PlayerResults");
      } else {
        this.setState(
          {
            tracker: tracker,
            timer: 5,
            flip: !this.state.flip,
            flip2: !this.state.flip2,
            canAnswer: true
          },
          () => {
            this.shuffleAnswers(
              this.props.questions[this.state.tracker].incorrect_answers,
              this.props.questions[this.state.tracker].correct_answer
            );
          }
        );
      }
    });
    socket.on("timer-countdown", time => {
      this.setState({ timer: time });
    });
  }

  componentDidMount() {
    socket.emit("join-room", { room: this.props.room });
    this.shuffleAnswers(
      this.props.questions[this.state.tracker].incorrect_answers,
      this.props.questions[this.state.tracker].correct_answer
    );
  }

  shuffleAnswers = (incorrectAnswers, correctAnswer) => {
    if (correctAnswer === "True" || correctAnswer === "False") {
      this.setState({ answers: ["True", "False"], correctAnswer });
    } else {
      let answers = _.concat(incorrectAnswers, correctAnswer);
      let shuffledAnswers = _.shuffle(answers);
      this.setState({ answers: shuffledAnswers, correctAnswer });
    }
  };

  checkAnswer = (answer, tracker) => {
    let tempPoints = [...this.state.points];
    if (answer === this.state.correctAnswer) {
      tempPoints[tracker] = true;
      this.setState({
        points: [...tempPoints],
        canAnswer: false,
        chosenAnswer: answer
      });
    } else {
      this.setState({
        points: [...tempPoints],
        canAnswer: false,
        chosenAnswer: answer
      });
    }
  };

  render() {
    return (
      <Motion
        defaultStyle={{ x: 500, y: -500, xOpacity: 0, yOpacity: 0 }}
        style={{
          x: this.state.flip
            ? spring(0, { stiffness: 90, damping: 15 })
            : spring(500, { stiffness: 180, damping: 15 }),
          xOpacity: this.state.flip ? spring(1) : spring(0),
          y: this.state.flip2
            ? spring(0, { stiffness: 90, damping: 15 })
            : spring(-500, { stiffness: 180, damping: 15 }),
          yOpacity: this.state.flip2 ? spring(1) : spring(0)
        }}
      >
        {mot => {
          return (
            <div
              style={{
                height: "100vh",
                width: `100%`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  position: "fixed",
                  top: "0%",
                  left: "0%",
                  transform: `translateY(${mot.x}px)`,
                  opacity: mot.xOpacity
                }}
              >
                {this.state.timer}
                {this.props.questions[this.state.tracker].question}
                {this.state.canAnswer ? (
                  this.state.answers.map((val, i) => {
                    return (
                      <div key={i}>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() =>
                            this.checkAnswer(val, this.state.tracker)
                          }
                        >
                          {val}
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <div>{this.state.chosenAnswer}</div>
                )}
              </div>
              <div
                style={{
                  position: "fixed",
                  top: "0%",
                  left: "0%",
                  transform: `translateY(${mot.y}px)`,
                  opacity: mot.yOpacity
                }}
              >
                {this.state.timer}
                {this.props.questions[this.state.tracker].question}
                {this.state.canAnswer ? (
                  this.state.answers.map((val, i) => {
                    return (
                      <Button
                        key={i}
                        variant="contained"
                        size="large"
                        onClick={() =>
                          this.checkAnswer(val, this.state.tracker)
                        }
                      >
                        {val}
                      </Button>
                    );
                  })
                ) : (
                  <div>{this.state.chosenAnswer}</div>
                )}
              </div>
            </div>
          );
        }}
      </Motion>
    );
  }
}

function mapStateToProps(state) {
  return {
    questions: state.questions,
    room: state.room,
    character: state.character
  };
}

export default connect(mapStateToProps)(Round1Questions);
