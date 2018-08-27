import React from "react";
import io from "socket.io-client";
import { connect } from "react-redux";
import toonavatar from "cartoon-avatar";

const socket = io.connect("http://localhost:3006/");

class WaitingLobby extends React.Component {
  constructor() {
    super();
    this.state = {
      playerList: [{ name: "Phil", avatar: 89 }, { name: "Sarah", avatar: 99 }]
    };
    socket.on("player-joined", player => {
      //id for male can be 1 - 129 or female 1 - 114
      let id = Math.floor(Math.random() * 129);
      player.avatar = id;
      let tempPlayerList = [...this.state.playerList];

      if (tempPlayerList.length < 8) tempPlayerList.push(player);
      this.setState({ playerList: [...tempPlayerList] });
    });
  }

  componentDidMount() {
    socket.emit("connect-room", { room: this.props.room });
  }

  render() {
    return (
      <div>
        {this.props.room}
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
  }
}

function mapStateToProps(state) {
  return { room: state.room };
}

export default connect(mapStateToProps)(WaitingLobby);
