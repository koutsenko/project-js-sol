import React from 'react';

export default class Deck extends React.Component {
  render() {
    return (
      <div className="deck holder" onClick={this.props.handler}>
        {this.props.children}
      </div>
    );
  }
}
