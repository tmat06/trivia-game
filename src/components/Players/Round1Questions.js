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

class Round1Questions extends React.Component {
  constructor() {
    super();
    this.state = {
      tracker: 0,
      timer: 5
    };
    socket.on("tracker-update", tracker => {
      tracker === -1
        ? this.props.history.push("/PlayerResults")
        : this.setState({ tracker: tracker });
    });
    socket.on("timer-countdown", time => {
      this.setState({ timer: time });
    });
  }

  componentDidMount() {
    socket.emit("join-room", { room: this.props.room });
  }

  render() {
    return (
      <div>
        {this.state.timer}
        {this.props.questions[this.state.tracker].question}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { questions: state.questions, room: state.room };
}

export default connect(mapStateToProps)(Round1Questions);
