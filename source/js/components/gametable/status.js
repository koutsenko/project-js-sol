import React from 'react';
import { connect } from 'react-redux';

class Status extends React.Component {
  calculateElapsedTime() {
    let elapsedSeconds  = Math.floor(this.props.elapsedTime);
    let elapsedMinutes  = Math.floor(elapsedSeconds/60);

    if (elapsedMinutes > 99) {
      return '99:99';
    } else {
      return ('0' + elapsedMinutes).slice(-2) + ':' + ('0' + (elapsedSeconds-elapsedMinutes*60)).slice(-2);
    }
  };


  render() {
    return (
      <div className="status">
        "Косынка"<br />классика<br />
        <div className="counter">
          ход {this.props.counter}
          <br/>
          {this.calculateElapsedTime()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    counter: state.gameCurrent.moveIndex,
    elapsedTime: state.gameCurrent.elapsedTime
  };
};

export default connect(mapStateToProps)(Status);