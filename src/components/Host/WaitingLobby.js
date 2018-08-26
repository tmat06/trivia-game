import React from "react";
import io from "socket.io-client";
import { connect } from "react-redux";

const socket = io.connect("http://localhost:3006");

class WaitingLobby extends React.Component {
  constructor() {
    super();
    this.state = {
      playerList: ["Phil", "Sarah"]
    };
    socket.on("player-joined", player => {
      let tempPlayerList = [...this.state.playerList];
      if (tempPlayerList.length < 8) tempPlayerList.push(player);
      this.setState({ playerList: [...tempPlayerList] });
    });
  }
  render() {
    return (
      <div>
        {this.props.room}
        <div>players</div>
        {this.state.playerList.map((val, i) => {
          return <div key={i}>{val}</div>;
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { room: state.room };
}

export default connect(mapStateToProps)(WaitingLobby);
