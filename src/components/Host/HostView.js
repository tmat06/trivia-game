import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import WaitingLobby from "./WaitingLobby";

class HostView extends React.Component {
  componentDidMount() {
    window.addEventListener("beforeunload", this.deleteRoom);
  }
  componentWillUnmount() {
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
  render() {
    return <WaitingLobby />;
  }
}

function mapStateToProps(state) {
  return { room: state.room };
}

export default connect(mapStateToProps)(HostView);
