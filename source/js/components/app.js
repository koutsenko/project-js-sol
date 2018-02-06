import   React                from 'react'                    ;
import   PropTypes            from 'prop-types'               ;
import { connect }            from 'react-redux'              ;
import { bindActionCreators } from 'redux'                    ;

import   toolsHash            from 'tools/hash'               ;

import   Board                from 'components/board'         ;
import   Menu                 from 'components/menu'          ;
import   Options              from 'components/popup/options' ;
import   Records              from 'components/popup/records' ;
import   Rules                from 'components/popup/rules'   ;

import   actionsGame          from 'actions/game'             ;
import   actionsApp           from 'actions/app'              ;

import   selectorsLayout      from 'selectors/layout'         ;
import   constantsLayout      from 'constants/layout'         ;

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      resizing: false
    };

    this.ref = undefined;
    this.resizeTimer = undefined;
    this.getRef = this.getRef.bind(this);
    this.haltEvent = this.haltEvent.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);
    this.hashChangeHander = this.hashChangeHander.bind(this);
  }

  componentDidMount() {
    const passive = true;
    const bannedEvents = ["gesturestart", "gesturechange", "gestureend", "touchstart", "touchmove", "touchend"];

    // выключаем браузерные жесты на iPhone кроме неотключаемого history swipe. Это можно было бы сделать через CSS, но сафари не умеет в touch-action: none
    bannedEvents.forEach((eventName) => {
      this.ref.addEventListener(eventName, this.haltEvent, { passive });
    });
    window.addEventListener('resize', this.resizeHandler, { passive });
    window.addEventListener('scroll', this.resizeHandler, { passive });
    window.addEventListener('hashchange', this.hashChangeHander, { passive });
  }

  haltEvent(event) {
    event.preventDefault();
  }

  resizeHandler() {
    clearTimeout(this.resizeTimer);
    this.setState({ resizing: true });

    this.resizeTimer = setTimeout(() => {
      this.props.resize(this.ref);
      setTimeout(() => {
        this.setState({ resizing: false });
      }, 0);
    }, 200);
  }

  hashChangeHander(event) {
    const oldHash = event.oldURL.split('#')[1];
    const cmd = toolsHash.getHashCmd();
    const p1 = toolsHash.getHashParm();
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

  getRef(element) {
    this.ref = element;
  }

  render() {
    let className = (this.props.mini ? "mini" : "");
    if (this.state.resizing) {
      className += ' resizing';
    }

    return (
      <div ref={this.getRef} id={constantsLayout.appIdName} style={this.props.style} className={className}>
        <Board      />
        <Menu       />
        <div id={constantsLayout.popupsIdName} className={this.props.mask ? 'visible' : null}>
          <Records  />
          <Rules    />
          <Options  />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  style : selectorsLayout.appStyle(state.fx.layout),
  mini  : state.fx.layout.mini,
  mask  : state.fx.maskVisible
});

const mapDispatchToProps = (dispatch) => ({
  deal    : bindActionCreators(actionsGame.deal, dispatch),
  dump    : bindActionCreators(actionsGame.dump, dispatch),
  load    : bindActionCreators(actionsGame.load, dispatch),
  resize  : bindActionCreators(actionsApp.resize, dispatch)
});

App.propTypes = {
  resize: PropTypes.func,
  dump: PropTypes.func,
  load: PropTypes.func,
  style: PropTypes.object,
  mini: PropTypes.bool,
  mask: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
