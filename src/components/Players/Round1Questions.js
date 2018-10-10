import React from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import { Motion, spring } from "react-motion";
import Button from "@material-ui/core/Button";
import _ from "lodash";
import { updatePoints } from "./../../ducks/reducer";

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
      currentPoints: 0,
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
      chosenAnswer: "",
      sent: true
    };
    socket.on("tracker-update", tracker => {
      if (tracker === -1) {
        socket.emit("scores", {
          room: this.props.room,
          points: this.state.points,
          character: this.props.character
        });
        this.props.updatePoints(this.state.points);
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
        currentPoints: ++this.state.currentPoints,
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
        defaultStyle={{ x: 100, y: -100, xOpacity: 1, yOpacity: 0 }}
        style={{
          x: this.state.flip
            ? spring(50, { stiffness: 90, damping: 15 })
            : spring(-100, { stiffness: 180, damping: 15 }),
          xOpacity: this.state.flip ? spring(1) : spring(0),
          y: this.state.flip2
            ? spring(-50, { stiffness: 90, damping: 15 })
            : spring(100, { stiffness: 180, damping: 15 }),
          yOpacity: this.state.flip2 ? spring(1) : spring(0)
        }}
      >
        {mot => {
          return (
            <div
              style={{
                height: "100vh",
                overflow: "hidden",
                position: "relative",
                width: `100%`
              }}
            >
              <div
                className="question-host"
                style={{
                  position: "fixed",
                  top: 5,
                  left: "50%",
                  transform: "translateX(-50%)"
                }}
              >
                {this.state.tracker + 1}
                /10
              </div>
              <div
                className="question-timer"
                style={{
                  position: "fixed",
                  top: 50,
                  left: "50%",
                  transform: "translateX(-50%)"
                }}
              >
                {this.state.timer}
              </div>
              <div
                className="question-host"
                style={{
                  position: "fixed",
                  top: 85,
                  left: "50%",
                  transform: "translateX(-50%)"
                }}
              >
                Points:
                {this.state.currentPoints}
              </div>
              <div
                style={{
                  position: "relative",
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column"
                }}
              >
                <div
                  style={{
                    transform: `translateY(${mot.x}%)`,
                    opacity: mot.xOpacity
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <div className="question-player">
                      {this.props.questions[this.state.tracker].question}
                    </div>
                    {this.state.canAnswer ? (
                      this.state.answers.map((val, i) => {
                        return (
                          <Button
                            key={i}
                            style={{ margin: "10 0" }}
                            variant="contained"
                            size="large"
                            fullWidth={true}
                            onClick={() =>
                              this.checkAnswer(val, this.state.tracker)
                            }
                          >
                            {val}
                          </Button>
                        );
                      })
                    ) : (
                      <div className="question-timer">
                        {this.state.chosenAnswer}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    transform: `translateY(${mot.y}%)`,
                    opacity: mot.yOpacity
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <div className="question-player">
                      {this.props.questions[this.state.tracker].question}
                    </div>
                    {this.state.canAnswer ? (
                      this.state.answers.map((val, i) => {
                        return (
                          <Button
                            key={i}
                            variant="contained"
                            size="large"
                            fullWidth={true}
                            onClick={() =>
                              this.checkAnswer(val, this.state.tracker)
                            }
                          >
                            {val}
                          </Button>
                        );
                      })
                    ) : (
                      <div
                        className="question-timer"
                        style={{ marginTop: "15px" }}
                      >
                        {this.state.chosenAnswer}
                      </div>
                    )}
                  </div>
                </div>
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

export default connect(
  mapStateToProps,
  { updatePoints }
)(Round1Questions);
