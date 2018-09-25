import React from "react";
import io from "socket.io-client";
import { connect } from "react-redux";
import toonavatar from "cartoon-avatar";
import { Motion, spring } from "react-motion";
import Button from "@material-ui/core/Button";

const socket = io.connect(
  "http://localhost:3006/",
  {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 99999
  }
);

class WaitingLobby extends React.Component {
  constructor() {
    super();
    this.state = {
      playerList: [
        { name: "Waiting...", avatar: 170 },
        { name: "Waiting...", avatar: 170 },
        { name: "Waiting...", avatar: 170 },
        { name: "Waiting...", avatar: 170 },
        { name: "Waiting...", avatar: 170 },
        { name: "Waiting...", avatar: 170 },
        { name: "Waiting...", avatar: 170 },
        { name: "Waiting...", avatar: 170 }
      ],
      tracker: 0
    };
    socket.on("joining-room", player => {
      let tempPlayerList = [...this.state.playerList];
      if (this.state.tracker < 7) {
        tempPlayerList[this.state.tracker] = player;
        this.setState({
          playerList: [...tempPlayerList],
          tracker: ++this.state.tracker
        });
      } else {
        console.log("player ignored");
      }
    });
  }

  componentDidMount() {
    socket.emit("connect-room", { room: this.props.room });
  }

  render() {
    return (
      <Motion
        defaultStyle={{ opacity: 0 }}
        style={{
          opacity: spring(1, { damping: 60, stiffness: 60 })
        }}
      >
        {mot => {
          return (
            <div id="waiting-lobby-container">
              <div id="waiting-lobby-name" style={{ opacity: mot.opacity }}>
                <h1>Room Name:</h1>
                <div>{this.props.room}</div>
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.props.moveRound("round1")}
              >
                Start Game
              </Button>
              <div id="waiting-lobby-players">
                {this.state.playerList.map((val, i) => {
                  let avatar = toonavatar.generate_avatar({
                    gender: "male",
                    id: val.avatar
                  });

                  return (
                    <div
                      key={i}
                      style={{ margin: 5, backgroundColor: "lightgrey" }}
                    >
                      <div className="waiting-lobby-player-name">
                        {val.name}
                      </div>
                      {val.avatar !== 170 ? (
                        <Motion
                          defaultStyle={{ op: 0, op2: 1 }}
                          style={{
                            op: spring(1, { stiffness: 90, damping: 60 })
                          }}
                        >
                          {mot => {
                            return (
                              <div
                                style={{
                                  height: 185,
                                  width: 185,
                                  backgroundColor: "#333",
                                  opacity: mot.op
                                }}
                              >
                                <img
                                  src={avatar}
                                  style={{
                                    borderRadius: "100px",
                                    opacity: mot.op - 0.01
                                  }}
                                />
                              </div>
                            );
                          }}
                        </Motion>
                      ) : (
                        <div
                          style={{
                            height: 185,
                            width: 185,
                            backgroundColor: "#333"
                          }}
                        />
                      )}
                    </div>
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
  return { room: state.room };
}

export default connect(mapStateToProps)(WaitingLobby);
