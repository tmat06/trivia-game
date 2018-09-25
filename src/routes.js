import React from "react";
import { Switch, Route } from "react-router-dom";
import LoginAnimation from "./components/Login/LoginAnimation";
import WaitingLobby from "./components/Host/WaitingLobby";
import WaitingView from "./components/Players/WaitingView";

export default (
  <Switch>
    <Route exact path="/" component={LoginAnimation} />
    <Route path="/WaitingLobby" component={WaitingLobby} />
    <Route path="/WaitingView" component={WaitingView} />
  </Switch>
);
