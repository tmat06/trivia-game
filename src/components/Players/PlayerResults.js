import React from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import { purgeAll } from "./../../ducks/reducer";
import { Motion, spring } from "react-motion";

const socket = io.connect({
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 99999
});

class PlayerResults extends React.Component {
  constructor() {
    super();
    this.state = {
      rank: 0,
      reveal: false
    };
    socket.on("player-rankings", data => {
      data.rankings.forEach((val, i) => {
        let rank = i + 1;
        if (val.name === this.props.name) this.setState({ rank });
      });
    });
  }

  playAgain() {
    this.props.purgeAll();
    this.props.history.push("/");
  }

  componentDidMount() {
    socket.emit("join-room", { room: this.props.room });
    setTimeout(() => {
      this.setState({ reveal: true });
    }, 2500);
  }

  componentWillUnmount() {
    socket.emit("leave-room", { room: this.props.room });
  }

  render() {
    return (
      <Motion
        defaultStyle={{ xOpacity: 0 }}
        style={{
          xOpacity: this.state.reveal
            ? spring(1, { damping: 30, stiffness: 15 })
            : spring(0)
        }}
      >
        {mot => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                height: "100vh"
              }}
            >
              <div className="question-host">You Placed:</div>
              <div
                className="question-timer"
                style={{ fontSize: "80px", opacity: mot.xOpacity }}
              >
                {this.state.rank}
              </div>
              <div style={{ display: "flex" }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth={true}
                  onClick={() => this.setState({ questions: true })}
                >
                  Questions
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth={true}
                  onClick={() => this.playAgain()}
                >
                  Play Again
                </Button>
              </div>
              <Drawer
                anchor="bottom"
                open={this.state.questions}
                onClose={() => this.setState({ questions: false })}
              >
                <div
                  tabIndex={0}
                  role="button"
                  onClick={() => this.setState({ questions: false })}
                  onKeyDown={() => this.setState({ questions: false })}
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
                      let color = this.props.points[i]
                        ? "#e2ffe2"
                        : "rgb(250, 193, 193)";
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
                              color: "#435961",
                              backgroundColor: color,
                              width: "100%",
                              fontWeight: "bold",
                              marginBottom: "2px"
                            }}
                          >
                            {i + 1}. Question: {val.question}
                          </div>
                          <div
                            style={{
                              backgroundColor: color,
                              fontSize: "25px",
                              color: "#757575",
                              textShadow: "1px 1px 1px  #333",
                              width: "100%"
                            }}
                          >
                            Correct Answer: {val.correct_answer}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Drawer>
            </div>
          );
        }}
      </Motion>
    );
  }
}

function mapStateToProps(state) {
  return {
    name: state.character.name,
    room: state.room,
    questions: state.questions,
    points: state.points
  };
}

export default connect(
  mapStateToProps,
  { purgeAll }
)(PlayerResults);
