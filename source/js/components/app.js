import React      from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board      from './board';
import Menu       from './menu';
import About      from './popup/about';
import Records    from './popup/records';
import Rules      from './popup/rules';
import Mask       from './mask';

import gameActions from '../actions/games';

class App extends React.Component {
  componentDidMount() {
    if (window.location.hash.length) {
      this.props.load();
    } else {
      this.props.deal();
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