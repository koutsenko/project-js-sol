import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Card   from './gametable/card';
import Deck   from './gametable/deck';
import Open   from './gametable/open';
import Status from './gametable/status';
import Home   from './gametable/home';
import Stack  from './gametable/stack';

import gameActions from '../actions/games';

class GameTable extends React.Component {
  stackCards(source) {
    let array = source.slice();
    if (!array.length) {
      return null;
    }
    let card = array.shift();
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
      <div className="table">
        <Deck handler={this.props.openCard} disabled={!this.props.gameCurrent.canSwap}>
          {deckCards}
        </Deck>
        <Open>
          {openCards}
        </Open>
        <Status />
        <Home index="1">
          {home1Cards}
        </Home>
        <Home index="2">
          {home2Cards}
        </Home>
        <Home index="3">
          {home3Cards}
        </Home>
        <Home index="4">
          {home4Cards}
        </Home>          
        <Stack index="1">
          {stack1Cards}
        </Stack>
        <Stack index="2">
          {stack2Cards}
        </Stack>
        <Stack index="3">
          {stack3Cards}
        </Stack>
        <Stack index="4">
          {stack4Cards}
        </Stack>
        <Stack index="5">
          {stack5Cards}
        </Stack>
        <Stack index="6">
          {stack6Cards}
        </Stack>
        <Stack index="7">
          {stack7Cards}
        </Stack>
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

export default connect(mapStateToProps, mapDispatchToProps)(GameTable);