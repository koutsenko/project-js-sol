import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import aboutActions from '../../actions/about';

class Status extends React.Component {
  calculateElapsedTime() {
    let elapsedSeconds  = Math.floor(this.props.time);
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
        <div className="btn-about" onClick={this.props.openAbout}>
          "Косынка"<br />классика <br />©
        </div>
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
    counter : state.board.index,
    time    : state.game.time
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    openAbout: bindActionCreators(aboutActions.open, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Status);