import React from "react";
import { Switch, Route } from "react-router-dom";
import LoginAnimation from "./components/Login/LoginAnimation";
import WaitingLobby from "./components/Host/WaitingLobby";

export default (
  <Switch>
    <Route exact path="/" component={LoginAnimation} />
    <Route path="/WaitingLobby" component={WaitingLobby} />
  </Switch>
);
