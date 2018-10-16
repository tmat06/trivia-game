import React from "react";
import Button from "@material-ui/core/Button";
import { Motion, spring } from "react-motion";

export default function CreateRoom(props) {
  return (
    <Motion defaultStyle={{ opacity: 0 }} style={{ opacity: spring(1) }}>
      {mot => {
        return (
          <div style={{ opacity: mot.opacity }}>
            <input
              value={props.roomCreation}
              className="input"
              placeholder="Room Name"
              onChange={e =>
                props.fn.updateState(e.target.value, "roomCreation")
              }
              onFocus={() => props.fn.animateInput("createRoomTrigger")}
              onBlur={() => props.fn.triggerAnimation("createRoomTrigger")}
            />

            <Button
              variant="contained"
              color="primary"
              disabled={props.roomCreation ? false : true}
              onClick={() => props.fn.hostRoomClick()}
            >
              Host Room
            </Button>
            <hr />
            <div>OR</div>
            <hr />
            <Button
              variant="contained"
              color="primary"
              onClick={() => props.fn.roomChange("join-room")}
            >
              Return
            </Button>
          </div>
        );
      }}
    </Motion>
  );
}
