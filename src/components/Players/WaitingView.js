import React from "react";
import io from "socket.io-client";
import { connect } from "react-redux";
import toonavatar from "cartoon-avatar";
import { updateQuestions } from "./../../ducks/reducer";

const socket = io.connect({
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 99999
});

class WaitingView extends React.Component {
  constructor() {
    super();
    this.state = {};
    socket.on("questions", data => {
      this.props.updateQuestions(data);
      this.props.history.push("/Round1Questions");
    });
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
      <div id="waiting-view-player">
        <h1
          style={{
            padding: "5px",
            width: "80%",
            fontFamily: "Roboto, sans-serif",
            fontSize: "40px",
            textShadow: "1px 1px 1px #333"
          }}
        >
          {this.props.character.name}
        </h1>
        <img src={avatar} alt="player avatar" id="avatar-img" />
        <h3
          style={{
            color: "#333",
            fontFamily: "Roboto, sans-serif",
            fontSize: "30px",
            textShadow: "1px 1px 1px #333",
            padding: "5px"
          }}
        >
          {`ROOM: ${this.props.room}`}
        </h3>
        <p
          style={{
            fontFamily: "Roboto, sans-serif",
            fontSize: "20px",
            padding: "5px",
            color: "#333",
            fontWeight: "bold"
          }}
        >
          {`Waiting on Host to press start`}
          <div>
            <img
              src="/loader.png"
              alt="dot loading gif"
              style={{ height: "100px" }}
            />
          </div>
        </p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    room: state.room,
    character: state.character,
    questions: state.questions
  };
}

export default connect(
  mapStateToProps,
  { updateQuestions }
)(WaitingView);
