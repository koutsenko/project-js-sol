import   React                from 'react'            ;
import { connect }            from 'react-redux'      ;

import   selectorsLayout      from 'selectors/layout' ;

import   gameSelectors        from 'selectors/game'   ;
import   toolsTime            from 'tools/time'       ;

class Status extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state.time = Date.now();
    this.state.elapsed = '00:00';
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  startTimer(time) {
    clearInterval(this.timer);
    this.state.time = time || Date.now();
    this.timer = setInterval(function() {
      this.setState({
        elapsed: toolsTime.calculateElapsedTime(this.state.time, Date.now())
      });
    }.bind(this), 1000);
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.time === undefined) && (nextProps.time !== undefined)) {
      // новая игра
      this.startTimer(Date.now());
    } else if ((this.props.time !== undefined) && (nextProps.time !== undefined) && (nextProps.time !== this.props.time)) {
      // загруженная не новая игра
      this.startTimer(nextProps.time);
    } else if ((this.props.time !== undefined) && (nextProps.time === undefined)) {
      // останов игры
      this.stopTimer();
    }
  }

  render() {
    return (
      <div className="mxwsol-status" style={this.props.style}>
        "Косынка"<br />классика <br />
        <span style={{fontSize: '1.4em', lineHeight: '1em', opacity: this.props.mini ? '1' : '0', color: 'lightyellow', fontWeight: 'normal'}}>
          mini
        </span>
        <div className="counter">
          ход {this.props.counter}
          <br/>
          {this.state.elapsed}
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  let game = gameSelectors.getCurrentGame(state);

  return {
    style   : selectorsLayout.holderStyle(state, 'status'),
    counter : state.board.index,
    mini    : state.fx.layout.mini,
    layout  : state.fx.layout,
    time    : game ? game.time : undefined
  };
};

export default connect(mapStateToProps)(Status);
