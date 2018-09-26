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
      tracker: -1
    };
    socket.on("timer-finish", data => {
      console.log("hit after 5");
      this.setState({ tracker: ++this.state.tracker }, () => {
        if (this.state.tracker <= 9) {
          socket.emit("update-tracker", {
            tracker: this.state.tracker,
            room: this.props.room
          });
        } else {
          socket.emit("update-tracker", { tracker: -1, room: this.props.room });
          this.props.moveRound("results");
        }
      });
    });
  }

  componentDidMount() {
    socket.emit("connect-room", { room: this.props.room });
    this.props.updateQuestions(this.props.questions);
    this.setState({ introduction: true });
    setTimeout(() => {
      this.setState(
        { introduction: false, tracker: ++this.state.tracker },
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
        defaultStyle={{ x: -500, y: 500 }}
        style={{
          x: this.state.introduction
            ? spring(0, { stiffness: 60, damping: 7 })
            : spring(-800, { stiffness: 60, damping: 7 }),
          y:
            this.state.tracker !== -1
              ? spring(0, { stiffness: 60, damping: 17 })
              : spring(500, { stiffness: 60, damping: 17 })
        }}
      >
        {mot => {
          return (
            <div style={{ overflow: "hidden" }}>
              <div style={{ transform: `translateX(${mot.x}px)` }}>Round</div>
              <div style={{ transform: `translateX(${-mot.x}px)` }}>1</div>
              {this.state.tracker !== -1 ? (
                <div style={{ transform: `translateY(${mot.y}px)` }}>
                  {`${this.props.questions[this.state.tracker].question}`}
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
