import   React                from 'react'            ;
import { connect }            from 'react-redux'      ;

import   gameSelectors        from 'selectors/game'   ;

class Status extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state.time = 0;
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  startTimer(time) {
    clearInterval(this.timer);
    this.state.time = time || 0;
    this.timer = setInterval(function() {
      this.setState({
        time: this.state.time + 1
      });
    }.bind(this), 1000);
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.time === undefined) && (nextProps.time !== undefined)) {
      // новая игра
      this.startTimer();
    } else if ((this.props.time !== undefined) && (nextProps.time !== undefined) && (nextProps.time !== this.props.time)) {
      // загруженная не новая игра
      this.startTimer(nextProps.time);
    } else if ((this.props.time !== undefined) && (nextProps.time === undefined)) {
      // останов игры
      this.stopTimer();
    }
  }

  calculateElapsedTime() {
    let elapsedSeconds  = Math.floor(this.state.time);
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
        "Косынка"<br />классика <br />
        <span style={{fontSize: '1.4em', lineHeight: '1em', opacity: this.props.mini ? '1' : '0', color: 'lightyellow', fontWeight: 'normal'}}>
          mini
        </span>
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
  let game = gameSelectors.getCurrentGame(state);

  return {
    counter : state.board.index,
    mini    : state.fx.mini,
    time    : game ? game.time : undefined
  };
};

export default connect(mapStateToProps)(Status);