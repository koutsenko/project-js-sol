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
  onHashChange(event) {
    let oldHash = event.oldURL.split('#')[1];
    let cmd = getHashCmd();
    let p1 = getHashParm();
    console.log('hash cmd = ', cmd);
    if (cmd === 'dump') {
      this.props.dump();
    } else if (cmd === 'load') {
      this.props.load(p1);
    }
    if (oldHash !== undefined) {
      window.location.hash = oldHash;
    } else {
      window.history.pushState('', '/', window.location.pathname);
    }
    event.preventDefault();
  }

  componentDidMount() {
    let cmd = getHashCmd();
    let p1 = getHashParm();

    if (cmd === 'load') {
      this.props.load(p1);
      window.history.pushState('', '/', window.location.pathname);
    } else if (cmd === 'deal') {
      this.props.deal(p1 || Date.now());
    } else {
      this.props.deal(Date.now());
    }

    window.onhashchange = this.onHashChange.bind(this);
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
    deal: bindActionCreators(gameActions.deal, dispatch),
    dump: bindActionCreators(gameActions.dump, dispatch),
    load: bindActionCreators(gameActions.load, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);