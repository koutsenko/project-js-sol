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
    var home1Cards = this.stackCards.call(this, this.props.homes[0]);
    var home2Cards = this.stackCards.call(this, this.props.homes[1]);
    var home3Cards = this.stackCards.call(this, this.props.homes[2]);
    var home4Cards = this.stackCards.call(this, this.props.homes[3]);
    var stack1Cards = this.stackCards.call(this, this.props.stacks[0]);
    var stack2Cards = this.stackCards.call(this, this.props.stacks[1]);
    var stack3Cards = this.stackCards.call(this, this.props.stacks[2]);
    var stack4Cards = this.stackCards.call(this, this.props.stacks[3]);
    var stack5Cards = this.stackCards.call(this, this.props.stacks[4]);
    var stack6Cards = this.stackCards.call(this, this.props.stacks[5]);
    var stack7Cards = this.stackCards.call(this, this.props.stacks[6]);

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
          <Home cardDropHandler={this.props.cardDrop} index={0}>
            {home1Cards}
          </Home>
          <Home cardDropHandler={this.props.cardDrop} index={1}>
            {home2Cards}
          </Home>
          <Home cardDropHandler={this.props.cardDrop} index={2}>
            {home3Cards}
          </Home>
          <Home cardDropHandler={this.props.cardDrop} index={3}>
            {home4Cards}
          </Home>
        </div>
        <div className="row">
          <Stack cardDropHandler={this.props.cardDrop} index={0}>
            {stack1Cards}
          </Stack>
          <Stack cardDropHandler={this.props.cardDrop} index={1}>
            {stack2Cards}
          </Stack>
          <Stack cardDropHandler={this.props.cardDrop} index={2}>
            {stack3Cards}
          </Stack>
          <Stack cardDropHandler={this.props.cardDrop} index={3}>
            {stack4Cards}
          </Stack>
          <Stack cardDropHandler={this.props.cardDrop} index={4}>
            {stack5Cards}
          </Stack>
          <Stack cardDropHandler={this.props.cardDrop} index={5}>
            {stack6Cards}
          </Stack>
          <Stack cardDropHandler={this.props.cardDrop} index={6}>
            {stack7Cards}
          </Stack>
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