import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Card   from './board/card';
import Deck   from './board/deck';
import Open   from './board/open';
import Status from './board/status';
import Home   from './board/home';
import Stack  from './board/stack';

import gameActions from '../actions/games';

class Board extends React.Component {
  stackCards(source) {
    let array = source.slice();
    if (!array.length) {
      return null;
    }
    let id = array.shift();
    let card = this.props.gameCurrent.cards[id];
    return (
      <Card children={this.stackCards(array)} card={card}/>
    );
  }

  render() {
    var deckCards = this.stackCards.call(this, this.props.gameCurrent.board.deck);
    var openCards = this.stackCards.call(this, this.props.gameCurrent.board.open);
    var home1Cards = this.stackCards.call(this, this.props.gameCurrent.board.homes[0]);
    var home2Cards = this.stackCards.call(this, this.props.gameCurrent.board.homes[1]);
    var home3Cards = this.stackCards.call(this, this.props.gameCurrent.board.homes[2]);
    var home4Cards = this.stackCards.call(this, this.props.gameCurrent.board.homes[3]);
    var stack1Cards = this.stackCards.call(this, this.props.gameCurrent.board.stacks[0]);
    var stack2Cards = this.stackCards.call(this, this.props.gameCurrent.board.stacks[1]);
    var stack3Cards = this.stackCards.call(this, this.props.gameCurrent.board.stacks[2]);
    var stack4Cards = this.stackCards.call(this, this.props.gameCurrent.board.stacks[3]);
    var stack5Cards = this.stackCards.call(this, this.props.gameCurrent.board.stacks[4]);
    var stack6Cards = this.stackCards.call(this, this.props.gameCurrent.board.stacks[5]);
    var stack7Cards = this.stackCards.call(this, this.props.gameCurrent.board.stacks[6]);

    return (
      <div id="board">
        <div className="row">
          <Deck handler={this.props.openCard} disabled={!this.props.gameCurrent.canSwap}>
            {deckCards}
          </Deck>
          <Open>
            {openCards}
          </Open>
          <Status />
          <Home index="0">
            {home1Cards}
          </Home>
          <Home index="1">
            {home2Cards}
          </Home>
          <Home index="2">
            {home3Cards}
          </Home>
          <Home index="3">
            {home4Cards}
          </Home>
        </div>
        <div className="row">
          <Stack index="0">
            {stack1Cards}
          </Stack>
          <Stack index="1">
            {stack2Cards}
          </Stack>
          <Stack index="2">
            {stack3Cards}
          </Stack>
          <Stack index="3">
            {stack4Cards}
          </Stack>
          <Stack index="4">
            {stack5Cards}
          </Stack>
          <Stack index="5">
            {stack6Cards}
          </Stack>
          <Stack index="6">
            {stack7Cards}
          </Stack>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    gameCurrent : state.gameCurrent
  };
}

const mapDispatchToProps = function(dispatch) {
  return {
    openCard:   bindActionCreators(gameActions.openCard   , dispatch),
    writeTurn:  bindActionCreators(gameActions.writeTurn  , dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);