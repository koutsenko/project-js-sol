import React from 'react';
import { connect }            from 'react-redux';
import { Motion, spring } from 'react-motion';
import { bindActionCreators } from 'redux';

import boardActions from '../../actions/board';

class Holder extends React.Component {
  constructor(props) {
    super(props);
    this.timeout = null;
  }

  getRef(motion) {
    this.Ref = motion ? motion.refs['holder'] : null;
  }

  componentWillReceiveProps(nextProps) {
    clearTimeout(this.timeout);
    if (nextProps.isDeclined && !this.props.isDeclined) {
      this.timeout = setTimeout(function() {
        this.props.flushDecline();
      }.bind(this), 500);
    }
  }

  render() {
    return (
      <Motion ref={this.getRef.bind(this)} defaultStyle={{
        dColor: this.props.isDeclined ? 1 : 0
      }} style={{
        dColor: spring(this.props.isDeclined ? 1 : 0)
      }}>
        {
          function(interpolatingStyle) {
            let style = this.props.isDeclined ? {
              boxShadow: `0 0 0.1em 0.3em rgba(255, 0, 0, ${interpolatingStyle.dColor})`
            } : {};

            return (
              <div style={style} ref="holder" data-index={this.props.index} data-id={this.props.id} className={this.props.className + " holder"}/>
            );
          }.bind(this)
        }
      </Motion>
    );
  }
};

Holder.propTypes = {
  id            : React.PropTypes.string.isRequired,
  className     : React.PropTypes.string.isRequired,
  index         : React.PropTypes.number
};

const mapStateToProps = function(state, ownProps) {
  return {
    isDeclined: state.board.declined === ownProps.id
  };
}

const mapDispatchToProps = function(dispatch) {
  return {
    flushDecline: bindActionCreators(boardActions.flushDecline, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Holder);