import React from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import { purgeAll } from "./../../ducks/reducer";

const socket = io.connect(
  "http://localhost:3006/",
  {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 99999
  }
);

class PlayerResults extends React.Component {
  constructor() {
    super();
    this.state = {
      rank: 0
    };
    socket.on("player-rankings", data => {
      data.rankings.forEach((val, i) => {
        if (val.name === this.props.name) this.setState({ rank: ++i });
      });
    });
  }

  playAgain() {
    this.props.purgeAll();
    this.props.history.push("/");
  }

  componentDidMount() {
    socket.emit("join-room", { room: this.props.room });
  }

  componentWillUnmount() {
    socket.emit("leave-room", { room: this.props.room });
  }

  render() {
    return (
      <div>
        PlayerResults
        <h1>You placed: {this.state.rank}</h1>
        <Button onClick={() => this.setState({ questions: true })}>
          Questions
        </Button>
        <Button onClick={() => this.playAgain()}>Play Again</Button>
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
                      fontFamily: "Roboto, sans-serif",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "space-around",
                      backgroundColor: "#D3D3D3",
                      width: "100%",
                      boxShadow: "1px 1px 1px #333",
                      margin: "5px 0",
                      padding: "5px"
                    }}
                  >
                    <div
                      id="result-questions-size"
                      style={{
                        color: "#556d75",
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
                        color: "#66aae7",
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
