import   React                from 'react'                    ;
import { connect }            from 'react-redux'              ;
import { bindActionCreators } from 'redux'                    ;

import   hashTools            from 'tools/hash'               ;

import   Board                from 'components/board'         ;
import   Menu                 from 'components/menu'          ;
import   Options              from 'components/popup/options' ;
import   Records              from 'components/popup/records' ;
import   Rules                from 'components/popup/rules'   ;
import   Mask                 from 'components/mask'          ;

import   gameActions          from 'actions/games'            ;

class App extends React.PureComponent {
  onHashChange(event) {
    let oldHash = event.oldURL.split('#')[1];
    let cmd = hashTools.getHashCmd();
    let p1 = hashTools.getHashParm();
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
    let cmd = hashTools.getHashCmd();
    let p1 = hashTools.getHashParm();

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
      <div id="app" className={(this.props.mini ? "mini" : "")}>
        <Board      />
        <Menu       />
        <div id="popups">
          <Mask     />
          <Records  />
          <Rules    />
          <Options  />
        </div>
      </div>
    );
  }
};

const mapStateToProps = function(state) {
  return {
    mini: state.fx.mini
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    deal: bindActionCreators(gameActions.deal, dispatch),
    dump: bindActionCreators(gameActions.dump, dispatch),
    load: bindActionCreators(gameActions.load, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);