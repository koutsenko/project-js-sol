import React from 'react';
import { connect } from 'react-redux';

class Popup extends React.Component {
  render() {
    return (
      <div className={this.props.role + ' window' + (this.props.visible ? ' visible' : '')} ref={this.props.role}>
        {this.props.children}
        <div className="close" onClick={this.props.handler}>&times;</div>
      </div>
    );
  }
};

const mapStateToProps = function(state) {
  return state;
};

const mapDispatchToProps = function(dispatch) {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Popup);