import React from 'react';

class Deck extends React.Component {
  render() {
    return (
      <div ref="deck" className="deck holder">
        {this.props.children}
      </div>
    );
  }
}

export default Deck;
