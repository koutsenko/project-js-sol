import React from 'react';
import Hammer from 'react-hammerjs';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { places } from '../constants/app';
import boardActions from '../actions/board';
import Card   from './board/card';
import Deck   from './board/holder/deck';
import Home   from './board/holder/home';
import Open   from './board/holder/open';
import Stack  from './board/holder/stack';
import Status from './board/status';


class Board extends React.Component {
  onTargetSelect(target) {
    if (target.classList.contains('card')) {
      let targetCard = this.props.board.cards[target.dataset['id']];
      this.props.cardDrop(this.props.board.selected, targetCard.place.owner.type, targetCard.place.owner.index);
    } else if (target.classList.contains('stack')) {
      this.props.cardDrop(this.props.board.selected, places.STACK, parseInt(target.dataset['index']));
    } else if (target.classList.contains('home')) {
      this.props.cardDrop(this.props.board.selected, places.HOME, parseInt(target.dataset['index']));
    }
  }

  handleClick(event) {
    let target = event.target;
    if (this.props.board.selected === undefined) {
      if (target.classList.contains('card')) {
        let card = this.props.board.cards[target.dataset['id']];
        if (card.place.owner.type === places.DECK) {
          this.props.deckCardClick();
        } else {
          if (!card.flip) {
            console.log('код выбора карты - выбор и индикация зеленым');
            this.props.cardSelectOk(card);
          } else {
            console.log('либо просто индикация красным');
            this.props.cardSelectFail(card);
          }
        }
      } else if (target.classList.contains('deck')) {
        this.props.deckClick();
      }
    } else {
      if (target.dataset['id'] === this.props.board.selected) {
        console.log('повторный клик на выбранную карту - раньше это был дабл-клик хэндлер');
        this.handleDoubleClick(event);
      } else if (target.classList.contains('card') || target.classList.contains('holder')) {
        console.log('что-то уже было выбрано и был клик на  потенциальную цель, думаем - ок и дроп куда-то ИЛИ фэйл..');
        this.onTargetSelect(target);
      } else {
        console.log('отмена выбора');
        this.props.cardSelectCancel();
      }
    }
  }

  hasChildrenCards(element) {
    return !!element.querySelector('.card');
  }

  handleDoubleClick(event) {
    let target = event.target;
    if (!target.classList.contains('card')) {
      return;
    };

    let card = this.props.board.cards[target.dataset['id']];
    if (((card.place.owner.type === places.OPEN) || (card.place.owner.type === places.STACK)) && (!this.hasChildrenCards(target))) {
      this.props.cardDoubleClick(card.id);
    }
  }

  stackCards(source) {
    let array = source.slice();
    if (!array.length) {
      return null;
    }
    let id = array.shift();
    let card = this.props.board.cards[id];
    
    return (
      <Card 
        card={card}
        children={this.stackCards(array)}
      />
    );
  }

  render() {
    var deckCards   = this.stackCards.call(this, this.props.board.deck);
    var openCards   = this.stackCards.call(this, this.props.board.open);
    var homesCards  = [];
    var stacksCards = [];
    
    for (var i = 0; i < 4; i++) {
      homesCards.push(this.stackCards.call(this, this.props.board.homes[i]));
    }
    for (var i = 0; i < 7; i++) {
      stacksCards.push(this.stackCards.call(this, this.props.board.stacks[i]));
    }

    return (
      <Hammer onTap={this.handleClick.bind(this)}>
        <div id="board" ref="board" className={this.props.disabled ? "disabled" : null}>
          <div className="row">
            <Deck>
              {deckCards}
            </Deck>
            <Open>
              {openCards}
            </Open>
            <Status />
            {homesCards.map(function(home, index) {
              return (
                <Home 
                  children        = {home}
                  index           = {index} 
                  key             = {index} 
                />
              );
            }.bind(this))}
          </div>
          <div className="row">
            {stacksCards.map(function(stack, index) {
              return (
                <Stack 
                  children        = {stack}
                  index           = {index}
                  key             = {index}
                />
              );
            }.bind(this))}
          </div>
        </div>
      </Hammer>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    board           : state.board,
    disabled        : !state.access.controlsEnabled
  };
}

const mapDispatchToProps = function(dispatch) {
  return {
    deckCardClick   : bindActionCreators(boardActions.deckCardClick     , dispatch),
    cardDoubleClick : bindActionCreators(boardActions.cardDoubleClick   , dispatch),
    cardDrop        : bindActionCreators(boardActions.cardDrop          , dispatch),
    cardSelectCancel: bindActionCreators(boardActions.cardSelectCancel  , dispatch),
    deckClick       : bindActionCreators(boardActions.deckClick         , dispatch),
    cardSelectOk    : bindActionCreators(boardActions.cardSelectOk      , dispatch),
    cardSelectFail  : bindActionCreators(boardActions.cardSelectFail    , dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);