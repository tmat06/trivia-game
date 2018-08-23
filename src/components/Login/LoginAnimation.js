import React, { Component } from "react";
import "./LoginAnimation.css";
import { Motion, spring } from "react-motion";
import JoinRoom from "./JoinRoom/JoinRoom";
import CreateRoom from "./CreateRoom/CreateRoom";

export default class LoginAnimation extends Component {
  constructor() {
    super();
    this.state = {
      focusTrigger: false,
      wing: true
    };
    this.roomChange = this.roomChange.bind(this);
    this.triggerAnimation = this.triggerAnimation.bind(this);
    this.animateInput = this.animateInput.bind(this);
  }

  triggerAnimation() {
    this.setState({ focusTrigger: !this.state.focusTrigger });
  }

  animateInput() {
    this.triggerAnimation();
  }

  roomChange(room) {
    this.setState({ room });
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
                animateInput: this.animateInput
              }}
            />
          );
        default:
          return (
            <JoinRoom
              fn={{
                roomChange: this.roomChange,
                triggerAnimation: this.triggerAnimation,
                animateInput: this.animateInput
              }}
            />
          );
      }
    };
    console.log("input", this.state.focusTrigger);
    return (
      <Motion
        defaultStyle={{ x: 200, opacity: 0, wings: 0, head: 0 }}
        style={{
          x: spring(50, { stiffness: 60, damping: 15 }),
          opacity: spring(1),
          wings: this.state.wing
            ? spring(30, { stiffness: 60, damping: 30 })
            : spring(10, { stiffness: 60, damping: 30 }),
          head: this.state.wing
            ? spring(20, { stiffness: 60, damping: 15 })
            : spring(0, { stiffness: 60, damping: 30 })
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
                  onClick={() => this.setState({ wing: !this.state.wing })}
                >
                  <div
                    id="animation-head"
                    style={{ transform: `translate(0px, ${mot.head}px)` }}
                  >
                    <div id="animation-eye-row">
                      <div className="animation-eye">
                        <div className="animation-pupil"> </div>
                      </div>
                      <div className="animation-eye">
                        <div className="animation-pupil" />
                      </div>
                    </div>
                    <div id="animation-beak">
                      <div
                        id="animation-mouth"
                        style={{
                          height: "5px",
                          width: "80%",
                          marginBottom: "10px"
                        }}
                      />
                    </div>
                  </div>
                  <div id="animation-body-core">
                    <div
                      className="animation-wing"
                      style={{
                        transform: `rotate(-${mot.wings}deg)`,
                        marginRight: "-50px",
                        boxShadow: "-.5px 0px 1px black"
                      }}
                    />
                    <div id="animation-body-torso">body</div>
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
              <div style={{ height: "25%" }}>{currentRoom()}</div>
            </div>
          );
        }}
      </Motion>
    );
  }
}
