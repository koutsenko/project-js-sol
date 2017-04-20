import React from 'react';

import interact from 'interact.js';

class Deck extends React.Component {
  componentDidMount() {
    let ir = interact(this.refs["deck"]);
    ir.on(['tap'], this.handleEmptyDeckClick.bind(this));
  }

  handleEmptyDeckClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    this.props.handler();
  }

  render() {
    return (
      <div ref="deck" className="deck holder">
        {this.props.children}
      </div>
    );
  }
}

Deck.propTypes = {
  handler: React.PropTypes.func.isRequired
};

export default Deck;
