import React from 'react';
import Hammer from 'react-hammerjs';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { highlights, places } from '../constants/app';
import boardActions from '../actions/board';
import Card   from './board/card';
import Holder from './board/holder';

import Status from './board/status';

const flatten = function(array2d) {
  return [].concat.apply([], array2d);
};

class Board extends React.Component {
  getDeckRef(component) { this.deckRef = component ? component.getWrappedInstance().Ref : null }
  getOpenRef(component) { this.openRef = component ? component.getWrappedInstance().Ref : null } 
  getStackRef(index)    { return function(component) { this['stack'+index+'Ref']  = component ? component.getWrappedInstance().Ref : null }}
  getHomeRef(index)     { return function(component) { this['home'+index+'Ref']   = component ? component.getWrappedInstance().Ref : null }}  

  handleClick(event) {
    let target = event.target;
    // FIXME топорный поиск выбранной карты...
    let selectedIds   = Object.keys(this.props.board.selected);
    let selectedId;
    for (var i = 0; i < selectedIds.length; i++) {
      if (this.props.board.selected[selectedIds[i]] === highlights.ACCEPT) {
        selectedId = selectedIds[i];
        break;
      }
    }

    if (!selectedId) {
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
      if (this.props.board.selected[target.dataset['id']] === highlights.ACCEPT) {
        console.log('повторный клик на выбранную карту - раньше это был дабл-клик хэндлер');
        this.handleDoubleClick(event);
      } else if (this.props.board.selected[target.dataset['id']] === highlights.DENY) {
        console.log('игнорируем клик в уже неверную карту');
      } else if (target.classList.contains('card') || target.classList.contains('holder')) {
        console.log('что-то уже было выбрано и был клик на  потенциальную цель, думаем - ок и дроп куда-то ИЛИ фэйл..');
        this.props.cardDrop(target.dataset['id']);
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

  buildCards(source, ref, isStack) {
    return source.map(function(id, index) {
      let card = this.props.board.cards[id];
      return (
        <Card 
          card={card}
          mini={this.props.fx.mini}
          isStack={isStack}
          parentElement={ref}
          index={index}
          key={card.id}
          flip={!card.flip}
          id={card.id}
        />
      );
    }.bind(this));
  }

  render() {
    var deckCards   = this.buildCards(this.props.board.deck, this.deckRef);
    var openCards   = this.buildCards(this.props.board.open, this.openRef);
    var homesCards  = [];
    var stacksCards = [];
    
    for (var i = 0; i < 4; i++) {
      homesCards.push(this.buildCards(this.props.board.homes[i], this["home"+i+"Ref"]));
    }
    for (var i = 0; i < 7; i++) {
      stacksCards.push(this.buildCards(this.props.board.stacks[i], this["stack"+i+"Ref"], true));
    }

    let cards = []
      .concat(deckCards)
      .concat(openCards)
      .concat(flatten(homesCards))
      .concat(flatten(stacksCards))
    ;

    cards.sort(function(a, b) {
      return a.props.id < b.props.id;
    });



    return (
      <Hammer onTap={this.handleClick.bind(this)}>
        <div id="board" ref="board" className={this.props.disabled ? "disabled" : null}>
          <div className="row">
            <Holder ref={this.getDeckRef.bind(this)} id="d" className="deck"/>
            <Holder ref={this.getOpenRef.bind(this)} id="o" className="open"/>
            <Status />
            <Holder ref={this.getHomeRef(0).bind(this)} id="h0" className="home"/>
            <Holder ref={this.getHomeRef(1).bind(this)} id="h1" className="home"/>
            <Holder ref={this.getHomeRef(2).bind(this)} id="h2" className="home"/>
            <Holder ref={this.getHomeRef(3).bind(this)} id="h3" className="home"/>
          </div>
          <div className="row">
            <Holder ref={this.getStackRef(0).bind(this)} id="s0" className="stack"/>
            <Holder ref={this.getStackRef(1).bind(this)} id="s1" className="stack"/>
            <Holder ref={this.getStackRef(2).bind(this)} id="s2" className="stack"/>
            <Holder ref={this.getStackRef(3).bind(this)} id="s3" className="stack"/>
            <Holder ref={this.getStackRef(4).bind(this)} id="s4" className="stack"/>
            <Holder ref={this.getStackRef(5).bind(this)} id="s5" className="stack"/>
            <Holder ref={this.getStackRef(6).bind(this)} id="s6" className="stack"/>
          </div>
          <div className="cards">
            {cards}
          </div>
        </div>
      </Hammer>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    fx              : state.fx,
    board           : state.board,
    disabled        : !state.access.controlsEnabled
  };
}

const mapDispatchToProps = function(dispatch) {
  return {
    deckCardClick    : bindActionCreators(boardActions.deckCardClick     , dispatch),
    cardDoubleClick  : bindActionCreators(boardActions.cardDoubleClick   , dispatch),
    cardDrop         : bindActionCreators(boardActions.cardDrop          , dispatch),
    cardSelectCancel : bindActionCreators(boardActions.cardSelectCancel  , dispatch),
    deckClick        : bindActionCreators(boardActions.deckClick         , dispatch),
    cardSelectOk     : bindActionCreators(boardActions.cardSelectOk      , dispatch),
    cardSelectFail   : bindActionCreators(boardActions.cardSelectFail    , dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);