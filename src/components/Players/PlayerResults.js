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
            style={{
              height: "96vh",
              width: "100%",
              backgroundColor: "#EEE",
              overflow: "auto"
            }}
          >
            <div
              style={{
                height: "20%",
                width: "100%",
                backgroundColor: "#EEE",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "flex-start",
                boxShadow: "1px 1px 1px #333"
              }}
            >
              {this.props.questions.map((val, i) => {
                let color = this.props.points[i] ? "green" : "red";
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "space-around",
                      backgroundColor: "#D3D3D3"
                    }}
                  >
                    <div
                      style={{
                        fontSize: "30px",
                        fontColor: "#333",
                        color: color
                      }}
                    >
                      Question: {val.question}
                    </div>
                    <div
                      style={{
                        fontSize: "25px",
                        fontColor: "#333",
                        color: color
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
