import React from "react";
import Button from "@material-ui/core/Button";
import { Motion, spring } from "react-motion";

export default function JoinRoom(props) {
  return (
    <Motion defaultStyle={{ opacity: 0 }} style={{ opacity: spring(1) }}>
      {mot => {
        return (
          <div style={{ opacity: mot.opacity }}>
            <input
              className="input"
              placeholder="Name"
              onChange={e => props.fn.updateState(e.target.value, "name")}
              onFocus={() => props.fn.animateInput("focusTrigger")}
              onBlur={() => props.fn.triggerAnimation("focusTrigger")}
            />
            <input
              className="input"
              placeholder="Room Name"
              onChange={e => props.fn.updateState(e.target.value, "room")}
              onFocus={() => props.fn.animateInput("roomTrigger")}
              onBlur={() => props.fn.triggerAnimation("roomTrigger")}
            />

            <Button
              variant="contained"
              color="primary"
              disabled={props.name && props.room ? false : true}
              onClick={() => props.fn.joinRoomClick()}
            >
              Join
            </Button>
            <hr />
            <div>OR</div>
            <hr />
            <Button
              variant="contained"
              color="primary"
              onClick={() => props.fn.roomChange("create-room")}
            >
              Create Your Own Room
            </Button>
          </div>
        );
      }}
    </Motion>
  );
}
