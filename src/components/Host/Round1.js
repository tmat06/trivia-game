import React from "react";
import { Motion, spring } from "react-motion";
import io from "socket.io-client";
import { connect } from "react-redux";
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

class Round1 extends React.Component {
  constructor() {
    super();
    this.state = {
      introduction: false,
      tracker: -1,
      timer: 5,
      flip1: false,
      flip2: false
    };
    socket.on("timer-finish", data => {
      this.setState(
        {
          tracker: ++this.state.tracker,
          flip1: !this.state.flip1,
          flip2: !this.state.flip2
        },
        () => {
          if (this.state.tracker <= 9) {
            socket.emit("update-tracker", {
              tracker: this.state.tracker,

              room: this.props.room
            });
            socket.emit("timer-start", { room: this.props.room, time: 5 });
          } else {
            socket.emit("update-tracker", {
              tracker: -1,
              room: this.props.room
            });
            this.props.moveRound("results");
          }
        }
      );
    });

    socket.on("timer-countdown", time => {
      this.setState({ timer: time });
    });
  }

  componentDidMount() {
    socket.emit("connect-room", { room: this.props.room });
    this.props.updateQuestions(this.props.questions);
    this.setState({ introduction: true });
    setTimeout(() => {
      this.setState(
        {
          introduction: false,
          tracker: ++this.state.tracker,
          flip1: !this.state.flip1
        },
        () => {
          socket.emit("timer-start", { room: this.props.room, time: 5 });
          socket.emit("recieve-questions", {
            room: this.props.room,
            questions: this.props.questions
          });
        }
      );
    }, 3000);
  }

  render() {
    return (
      <Motion
        defaultStyle={{ x: -500, y: 500, z: -500 }}
        style={{
          x: this.state.introduction
            ? spring(0, { stiffness: 60, damping: 7 })
            : spring(-800, { stiffness: 60, damping: 7 }),
          y:
            this.state.flip1 === true
              ? spring(0, { stiffness: 60, damping: 17 })
              : spring(500, { stiffness: 60, damping: 17 }),
          z:
            this.state.flip2 === true
              ? spring(0, { stiffness: 60, damping: 17 })
              : spring(-500, { stiffness: 60, damping: 17 })
        }}
      >
        {mot => {
          return (
            <div
              style={{
                overflow: "hidden",
                height: "100vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                flexDirection: "column"
              }}
            >
              <div style={{ transform: `translateX(${mot.x}px)` }}>Get</div>
              <div style={{ transform: `translateX(${-mot.x}px)` }}>Ready</div>
              <div style={{ transform: `translateX(${mot.x}px)` }}>
                5 seconds to answer each question!
              </div>
              {this.state.tracker !== -1 ? (
                <div
                  style={{
                    position: "relative",
                    height: "100vh",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column"
                  }}
                >
                  <div style={{ transform: `translateY(${mot.y}px)` }}>
                    {this.state.timer}
                    {`${this.props.questions[this.state.tracker].question}`}
                  </div>
                  <div style={{ transform: `translateY(${mot.z}px)` }}>
                    {this.state.timer}
                    {`${this.props.questions[this.state.tracker].question}`}
                  </div>
                </div>
              ) : (
                <div />
              )}
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

export default connect(
  mapStateToProps,
  { updateQuestions }
)(Round1);
