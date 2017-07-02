import React from 'react';
import Hammer from 'react-hammerjs';
import { connect } from 'react-redux';

class Popup extends React.Component {

  render() {
    return (
      <Hammer onTap={this.props.handler.bind(this)}>
        <div className={this.props.role + ' window' + (this.props.visible ? ' visible' : '')} ref={this.props.role}>
          {this.props.children}
          <div className="close" ref="closeButton">&times;</div>
        </div>
      </Hammer>
    );
  }
};

Popup.propTypes = {
  handler: React.PropTypes.func.isRequired
};

export default Popup;