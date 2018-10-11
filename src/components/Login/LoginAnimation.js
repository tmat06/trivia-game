import React, { Component } from "react";
import "./LoginAnimation.css";
import { Motion, spring } from "react-motion";
import JoinRoom from "./JoinRoom/JoinRoom";
import CreateRoom from "./CreateRoom/CreateRoom";
import io from "socket.io-client";
import { joinRoom, updateCharacter } from "./../../ducks/reducer";
import { connect } from "react-redux";
import axios from "axios";

const socket = io.connect("http://localhost:3006");

class LoginAnimation extends Component {
  constructor() {
    super();
    this.state = {
      focusTrigger: false,
      roomTrigger: false,
      createRoomTrigger: false,
      wing: true,
      name: "",
      room: "",
      roomCreation: ""
    };
    this.roomChange = this.roomChange.bind(this);
    this.triggerAnimation = this.triggerAnimation.bind(this);
    this.animateInput = this.animateInput.bind(this);
    this.updateState = this.updateState.bind(this);
    this.hostRoomClick = this.hostRoomClick.bind(this);
    this.joinRoomClick = this.joinRoomClick.bind(this);
  }

  componentWillUnmount() {
    // socket.disconnect();
  }

  //callback functions
  triggerAnimation(state) {
    this.setState({ [state]: !this.state[state] });
  }

  animateInput(state) {
    this.setState({ [state]: !this.state[state] });
  }

  roomChange(room) {
    this.setState({ room });
  }

  updateState(val, stateKey) {
    if (val.length < 20) this.setState({ [stateKey]: val });
  }

  hostRoomClick() {
    //Stores room name on Redux and joins on server side
    this.props.joinRoom(this.state.roomCreation);
    socket.emit("connect-room", { room: this.state.roomCreation });
    axios
      .post("/create-room", { room: this.state.roomCreation })
      .then(response => {
        if (response.data === "Room Already Created") {
          alert("room already created");
        } else {
          this.props.history.push("/HostView");
        }
      });
  }

  joinRoomClick() {
    this.props.joinRoom(this.state.room);
    //avatar for male can be 1 - 129 or female 1 - 114
    let avatar = Math.floor(Math.random() * 129);
    const character = {
      name: this.state.name,
      room: this.state.room,
      avatar
    };
    console.log("should be emitting a join-room here", character);
    socket.emit("join-room", character);
    this.props.updateCharacter(character);
    this.props.history.push("/WaitingView");
  }

  //////////////////////////////////

  // Implement a tap on duck animation

  tapAnimation() {
    this.setState({ wing: !this.state.wing });
    setTimeout(() => {
      this.setState({ wing: !this.state.wing });
    }, 200);
  }

  render() {
    // This function will determine which form to render
    let currentRoom = () => {
      switch (this.state.room) {
        case "create-room":
          return (
            <CreateRoom
              fn={{
                roomChange: this.roomChange,
                triggerAnimation: this.triggerAnimation,
                animateInput: this.animateInput,
                updateState: this.updateState,
                hostRoomClick: this.hostRoomClick
              }}
              room={this.state.roomCreation}
            />
          );
        default:
          return (
            <JoinRoom
              fn={{
                roomChange: this.roomChange,
                triggerAnimation: this.triggerAnimation,
                animateInput: this.animateInput,
                updateState: this.updateState,
                joinRoomClick: this.joinRoomClick
              }}
              name={this.state.name}
              room={this.state.room}
            />
          );
      }
    };

    return (
      <Motion
        defaultStyle={{
          x: 200,
          opacity: 0,
          wings: 0,
          head: 0,
          input: 0,
          bodyInput: 0,
          beakInput: 0,
          eyeRowInput: 0,
          mouthInput: 90,
          eyeRow: 20
        }}
        style={{
          x: this.state.roomTrigger
            ? spring(180, { stiffness: 60, damping: 15 })
            : this.state.createRoomTrigger
              ? spring(120, { stiffness: 60, damping: 15 })
              : spring(50, { stiffness: 60, damping: 15 }),
          eyeRow: this.state.roomTrigger
            ? spring(5, { stiffness: 60, damping: 15 })
            : spring(20, { stiffness: 60, damping: 15 }),
          opacity: spring(1),
          wings: this.state.wing
            ? spring(30, { stiffness: 60, damping: 7 })
            : spring(10, { stiffness: 60, damping: 30 }),
          input: this.state.focusTrigger
            ? spring(20 - this.state.name.length, {
                stiffness: 90,
                damping: 30
              })
            : this.state.roomTrigger
              ? spring(0)
              : spring(0 - this.state.name.length, {
                  stiffness: 60,
                  damping: 30
                }),
          head: this.state.focusTrigger
            ? spring(20, {
                stiffness: 90,
                damping: 30
              })
            : this.state.roomTrigger
              ? spring(5, { stiffness: 90, damping: 15 })
              : spring(0, {
                  stiffness: 60,
                  damping: 30
                }),
          bodyInput: this.state.focusTrigger ? spring(20) : spring(0),
          beakInput: this.state.focusTrigger
            ? spring(-20 + this.state.name.length * 2, {
                stiffness: 60,
                damping: 15
              })
            : this.state.createRoomTrigger
              ? spring(-15 + this.state.roomCreation.length * 2, {
                  stiffness: 60,
                  damping: 15
                })
              : spring(0, {
                  stiffness: 60,
                  damping: 15
                }),
          eyeRowInput: this.state.focusTrigger
            ? spring(-20 + this.state.name.length * 2, {
                stiffness: 60,
                damping: 15
              })
            : this.state.createRoomTrigger
              ? spring(-10 + this.state.roomCreation.length * 2, {
                  stiffness: 60,
                  damping: 15
                })
              : this.state.roomTrigger
                ? spring(-5 + this.state.room.length, {
                    stiffness: 60,
                    damping: 15
                  })
                : spring(0, {
                    stiffness: 60,
                    damping: 15
                  }),
          mouthInput: this.state.focusTrigger
            ? spring(10 + this.state.name.length, {
                stiffness: 60,
                damping: 15
              })
            : this.state.createRoomTrigger
              ? spring(25 + this.state.roomCreation.length, {
                  stiffness: 60,
                  damping: 15
                })
              : spring(50 + this.state.name.length, {
                  stiffness: 60,
                  damping: 15
                })
        }}
      >
        {mot => {
          return (
            <div className="container">
              <div id="animation-frame">
                <div
                  id="animation-full-body"
                  style={{
                    transform: `translate(0px, ${mot.x}px)`
                  }}
                  onClick={() => this.tapAnimation()}
                >
                  <div
                    id="animation-head"
                    style={{
                      transform: `translate(-${mot.input}px, ${mot.head}px)`
                    }}
                  >
                    <div
                      id="animation-eye-row"
                      style={{
                        transform: `translate(${mot.eyeRowInput}px, ${
                          mot.eyeRow
                        }px)`
                      }}
                    >
                      <div className="animation-eye">
                        <div className="animation-pupil"> </div>
                      </div>
                      <div className="animation-eye">
                        <div className="animation-pupil" />
                      </div>
                    </div>
                    <div
                      id="animation-beak"
                      style={{
                        transform: `translate(${mot.beakInput}px, ${
                          mot.head
                        }px)`
                      }}
                    >
                      <div
                        id="animation-mouth"
                        style={{
                          height: "5px",
                          width: mot.mouthInput,
                          marginBottom: "10px",
                          transform: `translateX(-${mot.beakInput +
                            this.state.name.length}px)`
                        }}
                      />
                    </div>
                  </div>

                  <div
                    id="animation-body-core"
                    style={{ transform: `rotate(-${mot.bodyInput}deg)` }}
                  >
                    <div
                      className="animation-wing"
                      style={{
                        transform: `rotate(-${mot.wings}deg)`,
                        marginRight: "-50px",
                        boxShadow: "-.5px 0px 1px black"
                      }}
                    />
                    <div id="animation-body-torso" />
                    <div
                      className="animation-wing"
                      style={{
                        transform: `rotate(${mot.wings}deg)`,
                        marginLeft: "-50px",
                        boxShadow: "1px 0px 1px black"
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Input Forms */}
              <div style={{ height: "25%", marginBottom: "25px" }}>
                {currentRoom()}
              </div>
            </div>
          );
        }}
      </Motion>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(
  mapStateToProps,
  { joinRoom, updateCharacter }
)(LoginAnimation);
