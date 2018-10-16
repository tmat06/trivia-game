import React from "react";
import { connect } from "react-redux";
import { Motion, spring } from "react-motion";
import io from "socket.io-client";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";

const socket = io.connect({
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 99999
});

class Results extends React.Component {
  constructor() {
    super();
    this.state = {
      introduction: true,
      showResults: false,
      questionDisplay: false
    };
  }

  componentDidMount() {
    socket.emit("connect-room", { room: this.props.room });
    setTimeout(() => {
      this.setState({ introduction: false, showResults: true });
    }, 2000);
  }

  handlePlayAgain() {
    this.props.playAgainSetUp();
    this.props.moveRound("/");
  }

  render() {
    return (
      <Motion
        defaultStyle={{ x: 800, xOpacity: 0, y: 800, yOpacity: 0 }}
        style={{
          x: this.state.introduction ? spring(0) : spring(-800),
          xOpacity: this.state.introduction ? spring(1) : spring(0),
          y: this.state.showResults
            ? spring(0, { stiffness: 90, damping: 15 })
            : spring(800),
          yOpacity: this.state.showResults
            ? spring(1, { stiffness: 60, damping: 15 })
            : spring(0)
        }}
      >
        {mot => {
          return (
            <div
              style={{ height: "100vh", width: "100%", position: "relative" }}
            >
              <div
                className="question-timer"
                style={{
                  transform: `translateX(${mot.x}px)`,
                  opacity: mot.xOpacity
                }}
              >
                RESULTS
              </div>
              <div
                style={{
                  opacity: mot.yOpacity,
                  display: "flex",
                  justifyContent: "space-around"
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  fullWidth={true}
                  onClick={() => this.setState({ questionDisplay: true })}
                >
                  Questions
                </Button>
                <Drawer
                  anchor="bottom"
                  open={this.state.questionDisplay}
                  onClose={() => this.setState({ questionDisplay: false })}
                >
                  <div
                    tabIndex={0}
                    role="button"
                    onClick={() => this.setState({ questionDisplay: false })}
                    onKeyDown={() => this.setState({ questionDisplay: false })}
                    style={{ height: "auto" }}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        alignItems: "center",
                        margin: "15px 0"
                      }}
                    >
                      {this.props.questions.map((val, i) => {
                        return (
                          <div
                            key={i}
                            style={{
                              alignItems: "flex-start",
                              backgroundColor: "#D3D3D3",
                              boxShadow: "1px 1px 1px #333",
                              display: "flex",
                              flexDirection: "column",
                              fontFamily: "Roboto, sans-serif",
                              justifyContent: "space-around",
                              margin: "5px 0",
                              padding: "5px",
                              width: "100%"
                            }}
                          >
                            <div
                              id="result-questions-size"
                              style={{
                                color: "#556d75",
                                width: "100%",
                                fontWeight: "bold",
                                marginBottom: "2px"
                              }}
                            >
                              {i + 1}. Question: {val.question}
                            </div>
                            <div
                              style={{
                                fontSize: "25px",
                                color: "#757575",
                                textShadow: "1px 1px 1px  #333",
                                width: "100%"
                              }}
                            >
                              Answer: {val.correct_answer}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Drawer>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth={true}
                  onClick={() => this.handlePlayAgain()}
                >
                  Play Again
                </Button>
              </div>
              {this.props.rankings.map((val, i) => {
                return (
                  <div
                    key={i}
                    className="question-host"
                    style={{
                      opacity: mot.yOpacity,
                      transform: `translateY(${mot.y * i}px)`
                    }}
                  >
                    <div>{val.name}</div>
                    <div className="question-timer">{val.amtPoints}</div>
                  </div>
                );
              })}
            </div>
          );
        }}
      </Motion>
    );
  }
}

function mapStateToProps(state) {
  return { room: state.room, questions: state.questions };
}

export default connect(mapStateToProps)(Results);
