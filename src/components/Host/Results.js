import React from "react";
import { connect } from "react-redux";
import { Motion, spring } from "react-motion";
import io from "socket.io-client";

const socket = io.connect(
  "http://localhost:3006/",
  {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 99999
  }
);

class Results extends React.Component {
  constructor() {
    super();
    this.state = {
      introduction: true,
      showResults: false
    };
  }

  componentDidMount() {
    socket.emit("connect-room", { room: this.props.room });
    setTimeout(() => {
      this.setState({ introduction: false, showResults: true });
    }, 5000);
  }

  render() {
    return (
      <Motion
        defaultStyle={{ x: 800, xOpacity: 0, y: 800, yOpacity: 0 }}
        style={{
          x: this.state.introduction ? spring(0) : spring(-800),
          xOpacity: this.state.introduction ? spring(1) : spring(0),
          y: this.state.showResults
            ? spring(0, { stiffness: 90, damping: 15 })
            : spring(800),
          yOpacity: this.state.showResults
            ? spring(1, { stiffness: 60, damping: 15 })
            : spring(0)
        }}
      >
        {mot => {
          return (
            <div style={{ height: "100vh", width: "100%" }}>
              <div
                style={{
                  transform: `translateX(${mot.x}px)`,
                  opacity: mot.xOpacity
                }}
              >
                RESULTS
              </div>
              {this.props.rankings.map((val, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      opacity: mot.yOpacity,
                      transform: `translateY(${mot.y * i}px)`
                    }}
                  >
                    {val.name}
                    {val.amtPoints}
                  </div>
                );
              })}
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

export default connect(mapStateToProps)(Results);
