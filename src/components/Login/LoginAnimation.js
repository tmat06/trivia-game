import React, { Component } from "react";
import "./LoginAnimation.css";
import { Motion, spring } from "react-motion";
import JoinRoom from "./JoinRoom/JoinRoom";
import CreateRoom from "./CreateRoom/CreateRoom";
import { createECDH } from "crypto";

export default class LoginAnimation extends Component {
  constructor() {
    super();
    this.state = {
      focusTrigger: false
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

    return (
      <Motion
        defaultStyle={{ x: 20, opacity: 0 }}
        style={{ x: spring(0), opacity: spring(1) }}
      >
        {mot => {
          return (
            <div className="container">
              <div id="animation-frame">
                <div>
                  <div
                    style={{
                      height: "175px",
                      width: "175px",
                      backgroundColor: "darkgrey",
                      borderRadius: "15px"
                    }}
                  >
                    Head
                  </div>
                  <div>Body</div>
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
