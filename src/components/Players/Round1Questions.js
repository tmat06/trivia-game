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
      correctAnswer: ""
    };
    socket.on("tracker-update", tracker => {
      tracker === -1
        ? this.props.history.push("/PlayerResults")
        : this.setState(
            {
              tracker: tracker,
              timer: 5,
              flip: !this.state.flip,
              flip2: !this.state.flip2
            },
            () => {
              this.shuffleAnswers(
                this.props.questions[this.state.tracker].incorrect_answers,
                this.props.questions[this.state.tracker].correct_answer
              );
            }
          );
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
    let answers = _.concat(incorrectAnswers, correctAnswer);
    let shuffledAnswers = _.shuffle(answers);
    this.setState({ answers: shuffledAnswers, correctAnswer });
  };

  render() {
    return (
      <Motion
        defaultStyle={{ x: 500, y: -500 }}
        style={{
          x: this.state.flip
            ? spring(0, { stiffness: 90, damping: 15 })
            : spring(500, { stiffness: 150, damping: 15 }),
          y: this.state.flip2
            ? spring(0, { stiffness: 90, damping: 15 })
            : spring(-500, { stiffness: 150, damping: 15 })
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
                  top: "42%",
                  left: "42%",
                  transform: `translateY(${mot.x}px)`
                }}
              >
                {this.state.timer}
                {this.props.questions[this.state.tracker].question}
                {this.state.answers.map((val, i) => {
                  return (
                    <div key={i}>
                      <Button variant="contained" size="large">
                        {val}
                      </Button>
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  position: "fixed",
                  top: "42%",
                  left: "42%",
                  transform: `translateY(${mot.y}px)`
                }}
              >
                {this.state.timer}
                {this.props.questions[this.state.tracker].question}
                {this.state.answers.map((val, i) => {
                  return (
                    <Button variant="contained" size="large">
                      {val}
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        }}
      </Motion>
    );
  }
}

function mapStateToProps(state) {
  return { questions: state.questions, room: state.room };
}

export default connect(mapStateToProps)(Round1Questions);
