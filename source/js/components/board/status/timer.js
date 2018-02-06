import   React                from 'react'            ;
import   PropTypes            from 'prop-types'       ;
import { connect }            from 'react-redux'      ;

import   gameSelectors        from 'selectors/game'   ;
import   toolsTime            from 'tools/time'       ;

class Timer extends React.PureComponent {
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
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.time = time || Date.now();
    this.timer = setInterval(this.handleTick.bind(this), 1000);
  }

  handleTick() {
    this.setState({
      elapsed: toolsTime.calculateElapsedTime(this.state.time, Date.now())
    });
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
    return this.state.elapsed;
  }
}

const mapStateToProps = (state) => {
  const game = gameSelectors.getCurrentGame(state.game);

  return {
    time: game ? game.time : undefined
  };
};

Timer.propTypes = {
  time: PropTypes.number
};

export default connect(mapStateToProps)(Timer);
