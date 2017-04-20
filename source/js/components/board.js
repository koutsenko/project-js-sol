import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Card   from './board/card';
import Deck   from './board/deck';
import Open   from './board/open';
import Status from './board/status';
import Home   from './board/home';
import Stack  from './board/stack';

import boardActions from '../actions/board';

class Board extends React.Component {
  stackCards(source) {
    let array = source.slice();
    if (!array.length) {
      return null;
    }
    let id = array.shift();
    let card = this.props.cards[id];
    return (
      <Card singleClickHandler={this.props.cardClick} doubleClickHandler={this.props.cardDoubleClick} children={this.stackCards(array)} card={card}/>
    );
  }

  render() {
    var deckCards = this.stackCards.call(this, this.props.deck);
    var openCards = this.stackCards.call(this, this.props.open);
    var homesCards = [
      this.stackCards.call(this, this.props.homes[0]),
      this.stackCards.call(this, this.props.homes[1]),
      this.stackCards.call(this, this.props.homes[2]),
      this.stackCards.call(this, this.props.homes[3])
    ];
    var stacksCards = [
      this.stackCards.call(this, this.props.stacks[0]),
      this.stackCards.call(this, this.props.stacks[1]),
      this.stackCards.call(this, this.props.stacks[2]),
      this.stackCards.call(this, this.props.stacks[3]),
      this.stackCards.call(this, this.props.stacks[4]),
      this.stackCards.call(this, this.props.stacks[5]),
      this.stackCards.call(this, this.props.stacks[6])
    ];

    return (
      <div id="board">
        <div className="row">
          <Deck handler={this.props.deckClick}>
            {deckCards}
          </Deck>
          <Open>
            {openCards}
          </Open>
          <Status />
          {homesCards.map(function(home, index) {
            return (
              <Home key={index} cardDropHandler={this.props.cardDrop} index={index} children={home}/>
            );
          }.bind(this))}
        </div>
        <div className="row">
          {stacksCards.map(function(stack, index) {
            return (
              <Stack key={index} cardDropHandler={this.props.cardDrop} index={index} children={stack}/>
            );
          }.bind(this))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return state.board;
}

const mapDispatchToProps = function(dispatch) {
  return {
    cardClick       : bindActionCreators(boardActions.cardClick       , dispatch),
    cardDoubleClick : bindActionCreators(boardActions.cardDoubleClick , dispatch),
    cardDrop        : bindActionCreators(boardActions.cardDrop        , dispatch),
    deckClick       : bindActionCreators(boardActions.deckClick       , dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);