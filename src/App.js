import React from "react";
import classNames from "classnames";
import "./App.css";
import Form from "./components/Form";

const Container = function(props) {
  return (
    <div id="dog-park">
      <div className="container">{props.children}</div>
    </div>
  );
};

const ResultsContainer = function(props) {
  return (
    <div className="row" id="resultsHeader">
      <div className="col-6">
        <h1>Results</h1>{" "}
      </div>
      {props.children}
    </div>
  );
};

class App extends React.Component {
  state = { submitted: "" };

  reset() {
    window.location.reload();
  }

  callBackFunction = formSubmitted => {
    this.setState({ submitted: formSubmitted });
  };

  render() {
    return (
      <Container>
        <div
          className={classNames({
            row: true,
            overflowY: this.state.submitted
          })}
        >
          <div className={!this.state.submitted ? "col-md-12" : "d-none"}>
            <Form appCallback={this.callBackFunction} />
          </div>
          <div className={this.state.submitted ? "col-md-12" : "d-none"}>
            <ResultsContainer>
              <div className="col-6">
                <button className="btn float-right" onClick={this.reset}>
                  Reset
                </button>
              </div>
            </ResultsContainer>
            <div id="parkResults" />
          </div>
        </div>
      </Container>
    );
  }
}

export default App;
