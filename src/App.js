import React, { Component } from "react";
import "./reset.css";
import "./App.css";
import routes from "./routes";
import io from "socket.io-client";
// const socket = io.connect("http://localhost:3006");

class App extends Component {
  render() {
    return <div className="App">{routes}</div>;
  }
}

export default App;
