import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import interact from 'interactjs';

import rollActions from '../actions/rollstack';
import interactActions from '../actions/interact';


import { places } from '../constants/app';

import Card   from './board/card';
import Deck   from './board/holder/deck';
import Home   from './board/holder/home';
import Open   from './board/holder/open';
import Stack  from './board/holder/stack';
import Status from './board/status';

import boardActions from '../actions/board';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.pressed  = false;
    this.clientX0 = undefined;
    this.clientY0 = undefined;
  }

  componentDidMount() {
    let ir = interact('.holder ,.card');
    ir.styleCursor(false);
    ir.preventDefault('always');
    ir.dropzone({
      accept      : '.card',
      overlap     : 0.1,
      ondragenter : this.onDragEnter.bind(this),
      ondragleave : this.onDragLeave.bind(this),
      ondrop      : this.onDrop.bind(this)
    });
    ir.draggable({
      onmove      : this.onDragMove.bind(this),
      onend       : this.onDragEnd.bind(this),
      manualStart : true
    });
    ir.on('tap'       , this.handleSingleClick.bind(this));
    ir.on('doubletap' , this.handleDoubleClick.bind(this));
    ir.on('move'      , this.handleRolling.bind(this));
    ir.on('down'      , this.handleCursorDown.bind(this));
    ir.on('up'        , this.handleCursorRelease.bind(this));
  }

  handleCursorDown(event) {
    this.pressed = true;
  }

  handleCursorRelease(event) {
    this.pressed = false;
    if (this.props.interact_holder.rolling) {
      this.props.rollCancel();
    } else if (this.props.interact_holder.dragging) {
      this.props.dragEndCard();
    }
  }

  handleRolling(event) {
    if (this.props.interact_holder.dragging) {
      // во время перетаскивания мы вообще не будем обрабатывать движение курсора.
      return;
    }
    if (!this.props.interact_holder.rolling) {
      // единственный случай когда мы можем обрабатывать движение курсора НЕ во время роллинга, это намерение стартовать роллинг или перетаскивание
      // у нас суровые требования на этот случай - курсор д.б. над неперевернутой картой, в этот момент не должно совершаться перетаскивания и кнопка д.б. нажата
      if (!event.target.classList.contains('card') || event.target.classList.contains('flipped') || event.interaction.interacting() || !this.pressed || !event.interaction.pointerIsDown) {
        return;
      }

      let card = this.props.board.cards[event.target.dataset['id']];
      let interaction = event.interaction;
      let canRolled = this.props.mini && (card.place.owner.type === places.STACK) && (this.props.board.stacks[card.place.owner.index].filter(function(id) {
        return !this.props.board.cards[id].flip;
      }.bind(this)).length > 1);

      // итак, намерения угадываем исходя из возможностей
      if (canRolled) {
        // похоже что от нас хотят роллинг, стартуем:)
        this.clientX0 = event.clientX;
        this.clientY0 = event.clientY;
        this.props.rollStart(card.place.owner.type, card.place.owner.index, card.id);
      } else {
        // увы, это обычный drag-n-drop
        this.props.dragStartCard(card.place.owner.type, card.place.owner.index, card.id);
        interaction.start({ name: 'drag' }, event.interactable, event.target);
      }
    } else {
      if (!this.pressed) {
        return;
      }
      // идет процесс роллинга
      let dx = this.clientX0 - event.clientX;
      let dy = this.clientY0 - event.clientY;

      let strength = 0.75;
      
      // возможно что мы выкатились по dX настолько что процесс роллинга уже завершен, неважно что с dY, надо стартовать обычный drag-n-drop
      if (Math.abs(dx) > event.target.clientWidth*strength) {
        this.startDnd(event);
        return;
      }
      
      // нет, роллинг продолжается
      let multiplier = this.props.mini ? 4 : 7;
      let delta = Math.round(multiplier*dy/event.target.clientHeight);
      if (this.props.interact_holder.dYroll !== delta) {
        // карта сменилась, надо записать изменения в состояние fx
        this.props.rollChange(delta);
        return;
      } else if (this.rolledDeltaOut()) {
        this.startDnd(event);
        return;
      }
    }
  }

  startDnd(event) {
    let id = this.getRollingCardId();
    let card = this.props.board.cards[id];
    let element = this.refs["board"].querySelector('[class*="' + id + '"]');
    this.props.dragStartCard(card.place.owner.type, card.place.owner.index, id);
    event.interaction.pointerIsDown = true;
    event.interaction.start({ name: 'drag' }, event.interactable, element);
  }

  onDragEnter(event) {
    if (event.target.classList.contains('card')) {
      this.props.dragEnterCard(event.relatedTarget.dataset['id'], event.target.dataset['id']);
    } else if (event.target.classList.contains('stack')) {
      this.props.dragEnterStack(event.relatedTarget.dataset['id'], parseInt(event.target.dataset['index']));
    } else if (event.target.classList.contains('home')) {
      this.props.dragEnterHome(event.relatedTarget.dataset['id'], parseInt(event.target.dataset['index']));
    }
  }

  onDragLeave(event) {
    if (event.target.classList.contains('card')) {
      this.props.dragLeaveCard(event.relatedTarget.dataset['id'], event.target.dataset['id']);
    } else if (event.target.classList.contains('stack')) {
      this.props.dragLeaveStack(event.relatedTarget.dataset['id'], parseInt(event.target.dataset['index']));
    } else if (event.target.classList.contains('home')) {
      this.props.dragLeaveHome(event.relatedTarget.dataset['id'], parseInt(event.target.dataset['index']));
    }
  }

  onDrop(event) {
    if (event.target.classList.contains('card')) {
      let targetCard = this.props.board.cards[event.target.dataset['id']];
      this.props.cardDrop(event.relatedTarget.dataset['id'], targetCard.place.owner.type, targetCard.place.owner.index);
    } else if (event.target.classList.contains('stack')) {
      this.props.cardDrop(event.relatedTarget.dataset['id'], places.STACK, parseInt(event.target.dataset['index']));
    } else if (event.target.classList.contains('home')) {
      this.props.cardDrop(event.relatedTarget.dataset['id'], places.HOME, parseInt(event.target.dataset['index']));
    }
  }

  onDragEnd(event) {
    var target = event.target;
    target.style.webkitTransform = target.style.transform = null;  
    target.removeAttribute('data-x');
    target.removeAttribute('data-y');
    if (this.props.canRolled) {
      this.props.rollCancel();
    }
    this.props.dragEndCard();
  }

  onDragMove(event) {
    var target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    // update the positon attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    // translate the element
    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  }

  handleSingleClick(event) {
    if (event.target.classList.contains('card')) {
      let card = this.props.board.cards[event.target.dataset['id']];
      if (card.place.owner.type === places.DECK) {
        this.props.cardClick();
      }
    } else if (event.target.classList.contains('deck')) {
      this.props.deckClick();
    }
  }

  hasChildrenCards(element) {
    return !!element.querySelector('.card');
  }

  handleDoubleClick(event) {
    if (!event.target.classList.contains('card')) {
      return;
    };

    let card = this.props.board.cards[event.target.dataset['id']];
    if (((card.place.owner.type === places.OPEN) || (card.place.owner.type === places.STACK)) && (!this.hasChildrenCards(event.target))) {
      this.props.cardDoubleClick(card.id);
    }
  }

  getCurrentHolder() {
    let holder = {
      [places.OPEN] : this.props.board.open,
      [places.STACK]: this.props.board.stacks,
      [places.HOME] : this.props.board.homes
    }[this.props.interact_holder.type];
    if (this.props.interact_holder.index !== undefined) {
      holder = holder[this.props.interact_holder.index];
    }

    return holder;
  }

  rolledDeltaOut() {
    let strength = 5;
    let holder = this.getCurrentHolder();
    let min = holder.indexOf(holder.filter(function(id) { return !this.props.board.cards[id].flip }.bind(this))[0]);
    let max = holder.length-1;
    let calculatedIndex = this.props.board.cards[this.props.interact_holder.startId].place.index-this.props.interact_holder.dYroll;
    return ((calculatedIndex+strength) < min) || ((calculatedIndex-strength) > max);
  }

  getRollingCardId() {
    let holder = this.getCurrentHolder();
    let min = holder.indexOf(holder.filter(function(id) { return !this.props.board.cards[id].flip }.bind(this))[0]);
    let max = holder.length-1;
    let calculatedIndex = this.props.board.cards[this.props.interact_holder.startId].place.index-this.props.interact_holder.dYroll;
    calculatedIndex = Math.min(calculatedIndex, max);
    calculatedIndex = Math.max(calculatedIndex, min);
    return holder[calculatedIndex];
  }


  stackCards(source, canRolled) {
    let array = source.slice();
    if (!array.length) {
      return null;
    }
    let id = array.shift();
    let card = this.props.board.cards[id];
    
    let darkened = false;
    let rolling = false;

    if (this.props.interact_holder.rolling) {
      if ((card.place.owner.type === this.props.interact_holder.type) && (card.place.owner.index === this.props.interact_holder.index)) {
        // коряво, надо переписать
        let holder = {
          [places.OPEN] : this.props.board.open,
          [places.STACK]: this.props.board.stacks,
          [places.HOME] : this.props.board.homes
        }[this.props.interact_holder.type];
        if (this.props.interact_holder.index !== undefined) {
          holder = holder[this.props.interact_holder.index];
        }
        let min = 0;
        let max = holder.length-1;
        let calculatedIndex = this.props.board.cards[this.props.interact_holder.startId].place.index-this.props.interact_holder.dYroll;
        calculatedIndex = Math.min(calculatedIndex, max);
        calculatedIndex = Math.max(calculatedIndex, min);

        rolling = true;
        darkened = (
          (card.place.index < calculatedIndex) &&
          (!card.flip)
        );
      }
    }
    return (
      <Card 
        card={card}
        canRolled={!!canRolled && !card.flip}
        children={this.stackCards(array, canRolled)}
        darkened={darkened}
        rolling={rolling}
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
      let canRolled = this.props.mini && (this.props.board.stacks[i].filter(function(id) {
        return !this.props.board.cards[id].flip;
      }.bind(this)).length > 1);  
      stacksCards.push(this.stackCards.call(this, this.props.board.stacks[i], canRolled));
    }

    return (
      <div id="board" ref="board" className={this.props.disabled ? "disabled" : null}>
        <div className="row">
          <Deck>
            {deckCards}
          </Deck>
          <Open risen = {(this.props.interact_holder.type === places.OPEN) && (this.props.interact_holder.dragging)}>
            {openCards}
          </Open>
          <Status />
          {homesCards.map(function(home, index) {
            return (
              <Home 
                children        = {home}
                index           = {index} 
                key             = {index} 
                risen           = {(this.props.interact_holder.type === places.HOME) && (this.props.interact_holder.index === index) && (this.props.interact_holder.dragging)}
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
                magnified       = {(this.props.interact_holder.type === places.STACK) && (this.props.interact_holder.index === index) && (this.props.interact_holder.rolling)}
                risen           = {(this.props.interact_holder.type === places.STACK) && (this.props.interact_holder.index === index) && (this.props.interact_holder.rolling || this.props.interact_holder.dragging)}
              />
            );
          }.bind(this))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    board           : state.board,
    disabled        : !state.access.controlsEnabled,
    interact_holder : state.fx.interact_holder,
    mini            : state.fx.mini
  };
}

const mapDispatchToProps = function(dispatch) {
  return {
    cardClick       : bindActionCreators(boardActions.cardClick         , dispatch),
    cardDoubleClick : bindActionCreators(boardActions.cardDoubleClick   , dispatch),
    cardDrop        : bindActionCreators(boardActions.cardDrop          , dispatch),
    deckClick       : bindActionCreators(boardActions.deckClick         , dispatch),
    dragStartCard   : bindActionCreators(interactActions.dragStartCard  , dispatch),
    dragEndCard     : bindActionCreators(interactActions.dragEndCard    , dispatch),
    dragEnterCard   : bindActionCreators(interactActions.dragEnterCard  , dispatch),
    dragEnterStack  : bindActionCreators(interactActions.dragEnterStack , dispatch),
    dragEnterHome   : bindActionCreators(interactActions.dragEnterHome  , dispatch),
    dragLeaveCard   : bindActionCreators(interactActions.dragLeaveCard  , dispatch),
    dragLeaveStack  : bindActionCreators(interactActions.dragLeaveStack , dispatch),
    dragLeaveHome   : bindActionCreators(interactActions.dragLeaveHome  , dispatch),
    rollStart       : bindActionCreators(rollActions.start              , dispatch),
    rollChange      : bindActionCreators(rollActions.change             , dispatch),
    rollCancel      : bindActionCreators(rollActions.cancel             , dispatch),
    rollContinue    : bindActionCreators(rollActions.continue           , dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);