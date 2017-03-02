import React      from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import app        from '../../EP';

import GameTable  from './gametable';
import Menu       from './menu';
import Records    from './popup/records';
import Rules      from './popup/rules';
import Version    from './version';
import Watermark  from './watermark';
import Mask       from './mask';

import gameActions from '../actions/games';

class App extends React.Component {
  componentDidMount() {
    if (window.location.hash.length) {
      this.props.load();
    } else {
      this.props.deal();
    }
    app.queryEls();
    app.doLayout();  
    app.initXhr();
    app.setupResize();
  }

  render() {
    return (
      <div className="game">
        <Version />
        <Watermark />
        <Menu />
        <GameTable />
        <Records />
        <Rules />
        <Mask />
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