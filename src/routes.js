import React from "react";
import { Switch, Route } from "react-router-dom";
import LoginAnimation from "./components/Login/LoginAnimation";
import HostView from "./components/Host/HostView";
import WaitingView from "./components/Players/WaitingView";

export default (
  <Switch>
    <Route exact path="/" component={LoginAnimation} />
    <Route path="/HostView" component={HostView} />
    <Route path="/WaitingView" component={WaitingView} />
  </Switch>
);
