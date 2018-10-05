import React from "react";
import { Motion, spring } from "react-motion";
import io from "socket.io-client";
import { connect } from "react-redux";
import toonavatar from "cartoon-avatar";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

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
      playerList: [
        { name: "Waiting...", avatar: 170 },
        { name: "Waiting...", avatar: 170 },
        { name: "Waiting...", avatar: 170 },
        { name: "Waiting...", avatar: 170 },
        { name: "Waiting...", avatar: 170 },
        { name: "Waiting...", avatar: 170 },
        { name: "Waiting...", avatar: 170 },
        { name: "Waiting...", avatar: 170 }
      ],
      tracker: 0
    };
    socket.on("joining-room", player => {
      let tempPlayerList = [...this.state.playerList];
      if (this.state.tracker < 8) {
        tempPlayerList[this.state.tracker] = player;
        //Doing this to get rid of React Warning
        let tempTracker = this.state.tracker;
        tempTracker++;
        ////////////////////////////////////////
        this.setState({
          playerList: [...tempPlayerList],
          tracker: tempTracker
        });
      } else {
        console.log("player ignored");
      }
    });
  }

  componentDidMount() {
    socket.emit("connect-room", { room: this.props.room });
  }

  componentWillUnmount() {
    socket.disconnect();
  }

  render() {
    return (
      <Motion
        defaultStyle={{ opacity: 0 }}
        style={{
          opacity: spring(1, { damping: 60, stiffness: 60 })
        }}
      >
        {mot => {
          return (
            <div id="waiting-lobby-container">
              <div id="waiting-lobby-name" style={{ opacity: mot.opacity }}>
                <h1>Room Name:</h1>
                <div>{this.props.room}</div>
              </div>
              <h3>Category</h3>
              <Select
                style={{ width: "600px" }}
                open={this.state.open}
                onClose={() => this.setState({ open: false })}
                onOpen={() => this.setState({ open: true })}
                value={this.props.category}
                onChange={this.props.updateCategory}
              >
                <MenuItem value={-1}>Random</MenuItem>
                <MenuItem value={9}>General Knowledge</MenuItem>
                <MenuItem value={10}>Books</MenuItem>
                <MenuItem value={11}>Film</MenuItem>
                <MenuItem value={12}>Music</MenuItem>
                <MenuItem value={13}>Musicals and Theatres</MenuItem>
                <MenuItem value={14}>Television</MenuItem>
                <MenuItem value={15}>Video Games</MenuItem>
                <MenuItem value={16}>Board Games</MenuItem>
                <MenuItem value={17}>Science and Nature</MenuItem>
                <MenuItem value={18}>Computers</MenuItem>
                <MenuItem value={19}>Mathematics</MenuItem>
                <MenuItem value={20}>Mythology</MenuItem>
                <MenuItem value={21}>Sports</MenuItem>
                <MenuItem value={22}>Geography</MenuItem>
                <MenuItem value={23}>History</MenuItem>
                <MenuItem value={24}>Politics</MenuItem>
                <MenuItem value={25}>Art</MenuItem>
                <MenuItem value={26}>Celebrities</MenuItem>
                <MenuItem value={27}>Animals</MenuItem>
                <MenuItem value={28}>Vehicles</MenuItem>
                <MenuItem value={29}>Comics</MenuItem>
                <MenuItem value={30}>Gadgets</MenuItem>
                <MenuItem value={31}>Japanese and Manga</MenuItem>
                <MenuItem value={32}>Cartoon and Animations</MenuItem>
              </Select>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.props.moveRound("round1")}
              >
                Start Game
              </Button>
              <div id="waiting-lobby-players">
                {this.state.playerList.map((val, i) => {
                  let avatar = toonavatar.generate_avatar({
                    gender: "male",
                    id: val.avatar
                  });

                  return (
                    <div
                      key={i}
                      style={{ margin: 5, backgroundColor: "lightgrey" }}
                    >
                      <div className="waiting-lobby-player-name">
                        {val.name}
                      </div>
                      {val.avatar !== 170 ? (
                        <Motion
                          defaultStyle={{ op: 0, op2: 1 }}
                          style={{
                            op: spring(1, { stiffness: 90, damping: 60 })
                          }}
                        >
                          {mot => {
                            return (
                              <div
                                style={{
                                  height: 185,
                                  width: 185,
                                  backgroundColor: "#333",
                                  opacity: mot.op
                                }}
                              >
                                <img
                                  src={avatar}
                                  alt="player avatar"
                                  style={{
                                    borderRadius: "100px",
                                    opacity: mot.op - 0.01
                                  }}
                                />
                              </div>
                            );
                          }}
                        </Motion>
                      ) : (
                        <div
                          style={{
                            height: 185,
                            width: 185,
                            backgroundColor: "#333"
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
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
