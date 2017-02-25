import React from 'react';

export default class MenuButton extends React.Component {
  handlePress() {
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
      <div title={this.props.hint} className={this.props.role + (this.props.disabled ? ' disabled' : '')} onClick={this.handlePress.bind(this)} ref={this.props.role}>
        <div className="face">
          <div>{this.props.text}</div>
        </div>
      </div>
    );
  }
}
