import React from 'react';

export default class Deck extends React.Component {
  handlePress() {
    if (!this.props.disabled) {
      this.props.handler();
    }
  }

  render() {
    return (
      <div className="deck holder" onClick={this.handlePress.bind(this)}>
        <div className="face"></div>
        {this.props.children}
      </div>
    );
  }
}
