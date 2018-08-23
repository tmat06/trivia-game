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
        defaultStyle={{ x: 200, opacity: 0 }}
        style={{
          x: spring(50, { stiffness: 60, damping: 15 }),
          opacity: spring(1)
        }}
      >
        {mot => {
          return (
            <div className="container">
              <div id="animation-frame">
                <div
                  id="animation-full-body"
                  style={{
                    transform: `translateY(${mot.x}px)`
                  }}
                >
                  <div id="animation-head">
                    <div id="animation-eye-row">
                      <div className="animation-eye">
                        <div className="animation-pupil">pupil </div>
                      </div>
                      <div className="animation-eye">
                        <div className="animation-pupil">pupil </div>
                      </div>
                    </div>
                    <div id="animation-beak">Beak</div>
                  </div>
                  <div id="animation-body-core">
                    <div
                      style={{
                        height: "250px",
                        width: "30%",
                        borderRadius: "30px",
                        transform: `rotate(200deg)`,
                        backgroundColor: "blue",
                        transform: `translateY(${mot.x}px)`
                      }}
                    >
                      wing
                    </div>
                    <div id="animation-body-torso">body</div>
                    <div>wing</div>
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
