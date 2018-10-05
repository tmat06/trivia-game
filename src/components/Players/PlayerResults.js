import React from "react";
import { connect } from "react-redux";
import io from "socket.io-client";

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

  componentDidMount() {
    socket.emit("join-room", { room: this.props.room });
  }

  render() {
    return (
      <div>
        PlayerResults
        <h1>You placed: {this.state.rank}</h1>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    name: state.character.name,
    room: state.room
  };
}

export default connect(mapStateToProps)(PlayerResults);
