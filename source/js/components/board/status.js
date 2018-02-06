import   React                from 'react'            ;
import   PropTypes            from 'prop-types'       ;
import { connect }            from 'react-redux'      ;

import   Timer                from 'components/board/status/timer'     ;

import   selectorsLayout      from 'selectors/layout' ;

class Status extends React.PureComponent {
  render() {
    return (
      <div className="mxwsol-status" style={this.props.style}>
        &quot;Косынка&quot;<br/>классика <br/>
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

const mapStateToProps = (state) => ({
  style   : selectorsLayout.holderStyle('status', state.fx.layout),
  counter : state.turn.index,
  mini    : state.fx.layout.mini,
});

Status.propTypes = {
  style: PropTypes.object,
  mini: PropTypes.bool,
  counter: PropTypes.number
};

export default connect(mapStateToProps)(Status);
