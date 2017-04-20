import React from 'react';

import interact from 'interact.js';

class MenuButton extends React.Component {
  constructor(props) {
    super();
    this.state = {
      pressed: false
    }
  }

  componentDidMount() {
    let ir = interact(this.refs[this.props.role]);
    ir.on(['tap'], this.handlePress.bind(this));
  }

  handlePress(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.props.disabled) {
      return;
    }

    this.setState({
      pressed: true
    });
    setTimeout(function() {
      this.setState({
        pressed: false
      });
    }.bind(this), 250);
    this.props.handler();
  }

  render() {
    return (
      <div title={this.props.hint} className={this.props.role + " button" + (this.props.disabled ? ' disabled' : '') + (this.state.pressed ? ' pressed' : '')} ref={this.props.role}>
        <div>{this.props.text}</div>
      </div>
    );
  }
}

export default MenuButton;
