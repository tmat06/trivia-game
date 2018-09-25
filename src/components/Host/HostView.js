import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import WaitingLobby from "./WaitingLobby";
import Round1 from "./Round1";

class HostView extends React.Component {
  constructor() {
    super();
    this.state = {
      currentRound: "waitingLobby",
      questions: []
    };
  }
  componentDidMount() {
    window.addEventListener("beforeunload", this.deleteRoom);
  }
  componentWillUnmount() {
    axios.delete(`/delete-room/${this.props.room}`).then(response => {
      console.log("room deleted");
    });
    window.removeEventListener("beforeunload", this.deleteRoom);
  }

  deleteRoom = e => {
    //This will erase the room from the database so that it can be reused.
    e.preventDefault();
    axios.delete(`/delete-room/${this.props.room}`).then(response => {
      console.log("room deleted");
    });
    e.returnValue = "unloading";
  };

  moveRound = nextRound => {
    if (nextRound === "round1") {
      axios.get("/get-questions").then(response => {
        this.setState({ questions: [...response.data.results] });
      });
      this.setState({ currentRound: nextRound });
    }
  };

  roundChooser = () => {
    switch (this.state.currentRound) {
      case "waitingLobby":
        return <WaitingLobby moveRound={this.moveRound} />;
      case "round1":
        return (
          <Round1 moveRound={this.moveRound} questions={this.state.questions} />
        );
      default:
        return <WaitingLobby moveRound={this.moveRound} />;
    }
  };

  render() {
    return this.roundChooser();
  }
}

function mapStateToProps(state) {
  return { room: state.room };
}

export default connect(mapStateToProps)(HostView);
