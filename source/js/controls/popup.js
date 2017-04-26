import React from 'react';
import { connect } from 'react-redux';

import interact from 'interact.js';

class Popup extends React.Component {
  componentDidMount() {
    let ir = interact(this.refs["closeButton"]);
    ir.styleCursor(false);
    ir.preventDefault('always');
    ir.on('tap', this.props.handler);
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

export default Popup;