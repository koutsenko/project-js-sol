import React from 'react';
import { connect } from 'react-redux';

class Mask extends React.Component {
  render() {
    return (
      <div className={"mask" + (this.props.visible ? " visible" : "")}/>
    );
  }
};

const mapStateToProps = function(state) {
  return {
    visible : state.maskVisible
  };
}

export default connect(mapStateToProps)(Mask);