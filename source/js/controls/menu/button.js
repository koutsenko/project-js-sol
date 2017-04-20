import React from 'react';

import interact from 'interact.js';

class MenuButton extends React.Component {
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

    let el = this.refs[this.props.role];
    el.className += ' pressed';
    setTimeout(function() {
        el.className = el.className.replace(' pressed', '');
    }, 250);
    this.props.handler();
  }

  render() {
    return (
      <div title={this.props.hint} className={this.props.role + " button" + (this.props.disabled ? ' disabled' : '')} ref={this.props.role}>
        <div>{this.props.text}</div>
      </div>
    );
  }
}

export default MenuButton;
