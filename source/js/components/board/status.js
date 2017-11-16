import   React                from 'react'            ;
import { connect }            from 'react-redux'      ;

import   Timer                from 'components/board/status/timer'     ;

import   selectorsLayout      from 'selectors/layout' ;

import   gameSelectors        from 'selectors/game'   ;

class Status extends React.PureComponent {
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
          <Timer/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    style   : selectorsLayout.holderStyle('status', state.fx.layout),
    counter : state.turn.index,
    mini    : state.fx.layout.mini,
  };
};

export default connect(mapStateToProps)(Status);
