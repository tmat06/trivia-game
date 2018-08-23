import React from "react";
import Button from "@material-ui/core/Button";
import { Motion, spring } from "react-motion";

export default class CreateRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      room: ""
    };
  }
  render() {
    return (
      <Motion defaultStyle={{ opacity: 0 }} style={{ opacity: spring(1) }}>
        {mot => {
          return (
            <div style={{ opacity: mot.opacity }}>
              <input
                className="input"
                placeholder="Room Name"
                onChange={e => this.setState({ room: e.target.value })}
                onFocus={() => this.props.fn.animateInput()}
                onBlur={() => this.props.fn.triggerAnimation()}
              />

              <Button
                variant="contained"
                color="primary"
                disabled={this.state.room ? false : true}
              >
                Host Room
              </Button>
              <hr />
              <div>OR</div>
              <hr />
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.props.fn.roomChange("join-room")}
              >
                Return
              </Button>
            </div>
          );
        }}
      </Motion>
    );
  }
}
