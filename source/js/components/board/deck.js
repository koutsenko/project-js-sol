import React from 'react';

export default class Deck extends React.Component {
  render() {
    return (
      <div className="deck holder" onClick={this.props.handler}>
        <div className="face"></div>
        {this.props.children}
      </div>
    );
  }
}
