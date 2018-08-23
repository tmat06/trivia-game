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
      wing: true,
      name: ""
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
        defaultStyle={{
          x: 200,
          opacity: 0,
          wings: 0,
          head: 0,
          input: 0,
          bodyInput: 0,
          beakInput: 0,
          eyeRowInput: 0,
          mouthInput: 90
        }}
        style={{
          x: spring(50, { stiffness: 60, damping: 15 }),
          opacity: spring(1),
          wings: this.state.wing
            ? spring(30, { stiffness: 60, damping: 30 })
            : spring(10, { stiffness: 60, damping: 30 }),
          //causing too many issues with the input motion and tap on the head motion

          // head: this.state.wing
          //   ? spring(0, { stiffness: 90, damping: 9 })
          //   : spring(10, { stiffness: 60, damping: 9 }),

          input: this.state.focusTrigger
            ? spring(20, { stiffness: 90, damping: 30 })
            : spring(0, { stiffness: 60, damping: 30 }),
          bodyInput: this.state.focusTrigger ? spring(20) : spring(0),
          beakInput: this.state.focusTrigger
            ? spring(20, { stiffness: 60, damping: 15 })
            : spring(0, { stiffness: 60, damping: 15 }),
          eyeRowInput: this.state.focusTrigger
            ? spring(10, { stiffness: 60, damping: 15 })
            : spring(0, { stiffness: 60, damping: 15 }),
          mouthInput: this.state.focusTrigger
            ? spring(30, { stiffness: 60, damping: 15 })
            : spring(90, { stiffness: 60, damping: 15 })
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
                      transform: this.state.focusTrigger
                        ? `translate(-${mot.input}px, ${mot.input}px)`
                        : `translate(-${mot.input}px, ${mot.input}px)`

                      // : `translate(0px, ${mot.head}px)`
                    }}
                  >
                    <div
                      id="animation-eye-row"
                      style={{
                        transform: `translate(-${mot.eyeRowInput}px, ${
                          mot.beakInput
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
                        transform: `translate(-${mot.beakInput}px, ${
                          mot.beakInput
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
