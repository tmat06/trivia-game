import React from "react";
import { Motion, spring } from "react-motion";
import io from "socket.io-client";
import { connect } from "react-redux";
import { updateQuestions } from "./../../ducks/reducer";
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

class Round1 extends React.Component {
  constructor() {
    super();
    this.state = {
      introduction: false,
      tracker: -1,
      timer: 5,
      flip1: false,
      flip2: false,
      answers: [],
      correctAnswer: ""
    };
    socket.on("timer-finish", data => {
      let tempTracker = this.state.tracker;
      tempTracker++;
      this.setState(
        {
          tracker: tempTracker,
          flip1: !this.state.flip1,
          flip2: !this.state.flip2,
          timer: 5
        },
        () => {
          if (this.state.tracker <= 9) {
            this.shuffleAnswers(
              this.props.questions[this.state.tracker].incorrect_answers,
              this.props.questions[this.state.tracker].correct_answer
            );
            socket.emit("update-tracker", {
              tracker: this.state.tracker,
              room: this.props.room
            });
            socket.emit("timer-start", { room: this.props.room, time: 5 });
          } else {
            socket.emit("update-tracker", {
              tracker: -1,
              room: this.props.room
            });
            this.props.moveRound("results");
          }
        }
      );
    });

    socket.on("timer-countdown", time => {
      this.setState({ timer: time });
    });
  }

  componentDidMount() {
    socket.emit("connect-room", { room: this.props.room });
    this.props.updateQuestions(this.props.questions);
    this.setState({ introduction: true });
    setTimeout(() => {
      //doing this just to get rid of the react warning
      let tempTracker = this.state.tracker;
      tempTracker++;
      this.setState(
        {
          introduction: false,
          tracker: tempTracker,
          flip1: !this.state.flip1
        },
        () => {
          this.shuffleAnswers(
            this.props.questions[this.state.tracker].incorrect_answers,
            this.props.questions[this.state.tracker].correct_answer
          );
          socket.emit("timer-start", { room: this.props.room, time: 5 });
          socket.emit("recieve-questions", {
            room: this.props.room,
            questions: this.props.questions
          });
        }
      );
    }, 3000);
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

  render() {
    if (this.state.tracker > 9) this.props.moveRound("results");
    return (
      <Motion
        defaultStyle={{
          x: -500,
          y: 100,
          z: -100,
          xOpacity: 1,
          yOpacity: 1,
          zOpacity: 1
        }}
        style={{
          xOpacity: this.state.introduction ? spring(1) : spring(0),
          yOpacity: this.state.flip1 ? spring(1) : spring(0),
          zOpacity: this.state.flip2 ? spring(1) : spring(0),
          x: this.state.introduction
            ? spring(0, { stiffness: 60, damping: 7 })
            : spring(-800, { stiffness: 60, damping: 7 }),
          y:
            this.state.flip1 === true
              ? spring(50, { stiffness: 60, damping: 17 })
              : spring(-100, { stiffness: 60, damping: 17 }),
          z:
            this.state.flip2 === true
              ? spring(-50, { stiffness: 60, damping: 17 })
              : spring(100, { stiffness: 60, damping: 17 })
        }}
      >
        {mot => {
          return (
            <div
              style={{
                overflow: "hidden",
                height: "100vh",
                width: "100%",
                position: "relative"
              }}
            >
              <div style={{ position: "fixed", top: "42%", left: "42%" }}>
                <div
                  className="question-timer"
                  style={{
                    transform: `translateX(${mot.x}px)`,
                    opacity: mot.xOpacity
                  }}
                >
                  Get
                </div>
                <div
                  className="question-timer"
                  style={{
                    transform: `translateX(${-mot.x}px)`,
                    opacity: mot.xOpacity
                  }}
                >
                  Ready
                </div>
                <div
                  className="question-host"
                  style={{
                    fontSize: "20px",
                    transform: `translateX(${mot.x}px)`,
                    opacity: mot.xOpacity
                  }}
                >
                  5 seconds to answer each question!
                </div>
              </div>
              {this.state.tracker !== -1 && this.state.tracker !== 10 ? (
                <div
                  style={{
                    position: "relative",
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <div
                    style={{
                      transform: `translateX(${mot.y}%)`,
                      opacity: mot.yOpacity
                    }}
                  >
                    <div className="question-host">
                      {this.state.tracker + 1}
                      /10
                    </div>
                    <div className="question-timer">{this.state.timer}</div>
                    <div className="question-host">
                      {`${this.props.questions[this.state.tracker].question}`}
                    </div>
                    <div className="answer-display">
                      {this.state.answers.map((val, i) => {
                        return (
                          <div key={i} className="answer-choices">
                            {val}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div
                    style={{
                      transform: `translateX(${mot.z}%)`,
                      opacity: mot.zOpacity
                    }}
                  >
                    <div className="question-timer">{this.state.timer}</div>
                    <div className="question-host">
                      {`${this.props.questions[this.state.tracker].question}`}
                    </div>
                    <div className="answer-display">
                      {this.state.answers.map((val, i) => {
                        return (
                          <div key={i} className="answer-choices">
                            {val}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div />
              )}
            </div>
          );
        }}
      </Motion>
    );
  }
}

function mapStateToProps(state) {
  return { room: state.room };
}

export default connect(
  mapStateToProps,
  { updateQuestions }
)(Round1);
