import React from "react";
import io from "socket.io-client";
import { connect } from "react-redux";
import toonavatar from "cartoon-avatar";

const socket = io.connect(
  "http://localhost:3006/",

  {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 99999
  }
);

class WaitingView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    socket.emit("connect-room", { room: this.props.room });
  }

  render() {
    let avatar = toonavatar.generate_avatar({
      gender: "male",
      id: this.props.character.avatar
    });
    return (
      <div>
        {this.props.character.name}
        <img src={avatar} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { room: state.room, character: state.character };
}

export default connect(mapStateToProps)(WaitingView);
