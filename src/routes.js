import React from "react";
import { Switch, Route } from "react-router-dom";
import LoginAnimation from "./components/Login/LoginAnimation";
import HostView from "./components/Host/HostView";
import WaitingView from "./components/Players/WaitingView";
import Round1Questions from "./components/Players/Round1Questions";
import PlayerResults from "./components/Players/PlayerResults";

export default (
  <Switch>
    <Route exact path="/" component={LoginAnimation} />
    <Route path="/HostView" component={HostView} />
    <Route path="/WaitingView" component={WaitingView} />
    <Route path="/Round1Questions" component={Round1Questions} />
    <Route path="/PlayerResults" component={PlayerResults} />
  </Switch>
);
