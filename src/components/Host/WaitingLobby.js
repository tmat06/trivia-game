import React from "react";
import io from "socket.io-client";
import { connect } from "react-redux";
import toonavatar from "cartoon-avatar";
import { Motion, spring } from "react-motion";

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
      playerList: [{ name: "Phil", avatar: 89 }, { name: "Sarah", avatar: 99 }]
    };
    socket.on("joining-room", player => {
      let tempPlayerList = [...this.state.playerList];
      if (tempPlayerList.length < 8) tempPlayerList.push(player);
      this.setState({ playerList: [...tempPlayerList] }, () => {
        socket.emit("player-joined", {
          avatar: player.avatar,
          room: this.props.room,
          name: player.name
        });
      });
    });
  }

  componentDidMount() {
    socket.emit("connect-room", { room: this.props.room });
  }

  render() {
    console.log("player list", this.state.playerList);
    return (
      <Motion
        defaultStyle={{ opacity: 0 }}
        style={{ opacity: spring(1, { damping: 60, stiffness: 60 }) }}
      >
        {mot => {
          return (
            <div>
              <div id="waiting-room-name" style={{ opacity: mot.opacity }}>
                <h1>Room Name:</h1>
                <div>{this.props.room}</div>
              </div>
              <div>players</div>
              {this.state.playerList.map((val, i) => {
                let avatar = toonavatar.generate_avatar({
                  gender: "male",
                  id: val.avatar
                });
                return (
                  <div key={i}>
                    {val.name}
                    <img src={avatar} />
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
  return { room: state.room };
}

export default connect(mapStateToProps)(WaitingLobby);
