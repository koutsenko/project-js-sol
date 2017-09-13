import   React                from 'react'            ;
import   interact             from 'interactjs'       ;
import { connect }            from 'react-redux'      ;
import { bindActionCreators } from 'redux'            ; 

import   gameSelectors        from 'selectors/game'   ;
import   aboutActions         from 'actions/about'    ;

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

  componentDidMount() {
    this.ir = interact(this.refs['aboutBtn']);
    this.ir.styleCursor(false);
    this.ir.on('tap', this.props.openAbout.bind(this));
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
        <div className="btn-about" ref="aboutBtn">
          "Косынка"<br />классика <br />
          <span style={{fontSize: '1.5em', lineHeight: '1em'}}>
          {this.props.mini ? ('mini') : ('©')}
          </span>
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
  let game = gameSelectors.getCurrentGame(state);

  return {
    counter : state.board.index,
    mini    : state.fx.mini,
    time    : game ? game.time : undefined
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    openAbout: bindActionCreators(aboutActions.open, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Status);