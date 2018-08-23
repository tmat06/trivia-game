import React from "react";
import Button from "@material-ui/core/Button";
import { Motion, spring } from "react-motion";

export default class JoinRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
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
                placeholder="Name"
                onChange={e => this.setState({ name: e.target.value })}
                onFocus={() => this.props.fn.animateInput()}
                onBlur={() => this.props.fn.triggerAnimation()}
              />
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
                disabled={this.state.name && this.state.room ? false : true}
              >
                Join
              </Button>
              <hr />
              <div>OR</div>
              <hr />
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.props.fn.roomChange("create-room")}
              >
                Create Your Own Room
              </Button>
            </div>
          );
        }}
      </Motion>
    );
  }
}
