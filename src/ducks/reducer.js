import React from "react";
import JoinRoom from "../components/Login/JoinRoom/JoinRoom";

const initialState = {
  room: ""
};

const JOIN_ROOM = "JOIN_ROOM";

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case JOIN_ROOM:
      return Object.assign({}, state, { room: action.payload });

    default:
      return Object.assign({}, state);
  }
}

export function joinRoom(room) {
  return { type: JOIN_ROOM, payload: room };
}
