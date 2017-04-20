import React from 'react';
import { connect } from 'react-redux';

import interact from 'interact.js';

class Popup extends React.Component {
  componentDidMount() {
    let ir = interact(this.refs["closeButton"]);
    ir.on(['tap'], this.handleCloseButtonClick.bind(this));
  }

  handleCloseButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    this.props.handler();
  }

  render() {
    return (
      <div className={this.props.role + ' window' + (this.props.visible ? ' visible' : '')} ref={this.props.role}>
        {this.props.children}
        <div className="close" ref="closeButton">&times;</div>
      </div>
    );
  }
};

Popup.propTypes = {
  handler: React.PropTypes.func.isRequired
};

const mapStateToProps = function(state) {
  return state;
};

const mapDispatchToProps = function(dispatch) {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Popup);