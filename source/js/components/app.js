import React      from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getHashCmd, getHashParm } from '../tools/hash';

import Board      from './board';
import Menu       from './menu';
import About      from './popup/about';
import Records    from './popup/records';
import Rules      from './popup/rules';
import Mask       from './mask';

import gameActions from '../actions/games';

class App extends React.Component {
  componentDidMount() {
    let cmd = getHashCmd();
    let p1 = getHashParm();

    if (cmd === 'load') {
      this.props.load();
    } else if (cmd === 'deal') {
      this.props.deal(p1 || Date.now());
    } else {
      this.props.deal(Date.now());
    }
  }

  render() {
    return (
      <div id="app">
        <Board />
        <Menu />
        <div id="popups">
          <Mask />
          <About />
          <Records />
          <Rules />
        </div>
      </div>
    );
  }
};

const mapStateToProps = function(state) {
  return state;
};

const mapDispatchToProps = function(dispatch) {
  return {
    load: bindActionCreators(gameActions.load, dispatch),
    deal: bindActionCreators(gameActions.deal, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);