import React from "react";
import { connect } from "react-redux";

class Round1Questions extends React.Component {
  constructor() {
    super();
  }

  render() {
    return <div>Round1Questions</div>;
  }
}

function mapStateToProps(state) {
  return { questions: state.questions };
}

export default connect(mapStateToProps)(Round1Questions);
