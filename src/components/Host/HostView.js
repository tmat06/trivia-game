import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import WaitingLobby from "./WaitingLobby";
import Round1 from "./Round1";
import Results from "./Results";
import io from "socket.io-client";
import { updateQuestions } from "./../../ducks/reducer";

const socket = io.connect(
  "http://localhost:3006/",
  {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 99999
  }
);

class HostView extends React.Component {
  constructor() {
    super();
    this.state = {
      currentRound: "waitingLobby",
      questions: [],
      rankings: [],
      category: -1
    };
    socket.on("player-scores", data => {
      let amtPoints = data.points.filter((val, i) => {
        return val === true;
      });

      let tempRankings = [...this.state.rankings];
      data.character.amtPoints = amtPoints.length;
      tempRankings.push(data.character);
      let tempRanks = tempRankings.sort((a, b) => {
        return a.amtPoints < b.amtPoints;
      });
      this.setState({ rankings: [...tempRanks] });
      socket.emit("rankings", { room: this.props.room, rankings: tempRanks });
    });

    socket.on("questions", questions => {
      this.props.updateQuestions(questions);
    });
  }
  componentDidMount() {
    socket.emit("connect-room", { room: this.props.room });
    window.addEventListener("beforeunload", this.deleteRoom);
  }
  componentWillUnmount() {
    axios.delete(`/delete-room/${this.props.room}`).then(response => {});
    window.removeEventListener("beforeunload", this.deleteRoom);
    socket.disconnect();
  }

  deleteRoom = e => {
    //This will erase the room from the database so that it can be reused.
    e.preventDefault();
    axios.delete(`/delete-room/${this.props.room}`).then(response => {});
    e.returnValue = "unloading";
  };

  updateCategory = e => {
    this.setState({ category: e.target.value });
  };

  playAgainSetUp = () => {
    this.setState({ rankings: [], questions: [] });
  };

  moveRound = nextRound => {
    if (nextRound === "round1") {
      axios.get(`/get-questions/${this.state.category}`).then(response => {
        this.setState({ questions: [...response.data.results] });
      });
      this.setState({ currentRound: nextRound });
    }
    if (nextRound === "results") this.setState({ currentRound: nextRound });
    if (nextRound === "/") this.props.history.push("/");
  };

  roundChooser = () => {
    switch (this.state.currentRound) {
      case "waitingLobby":
        return (
          <WaitingLobby
            moveRound={this.moveRound}
            updateCategory={this.updateCategory}
            category={this.state.category}
          />
        );
      case "round1":
        return (
          <Round1 moveRound={this.moveRound} questions={this.state.questions} />
        );
      case "results":
        return (
          <Results
            questions={this.state.questions}
            rankings={this.state.rankings}
            moveRound={this.moveRound}
            playAgainSetUp={this.playAgainSetUp}
          />
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

export default connect(
  mapStateToProps,
  { updateQuestions }
)(HostView);
