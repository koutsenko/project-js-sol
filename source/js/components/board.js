import   React                from 'react'                                ;
import   interact             from 'interactjs'                           ;
import { bindActionCreators } from 'redux'                                ;
import { connect }            from 'react-redux'                          ;

import   API                  from 'components/board/api'                 ;
import   Card                 from 'components/board/card'                ;
import   Holder               from 'components/board/holder'              ;
import   Status               from 'components/board/status'              ;

import   Background           from 'components/board/listener/background' ;
import   Source               from 'components/board/listener/source'     ;
import   Target               from 'components/board/listener/target'     ;

import   actionsBoard         from 'actions/board'                        ;
import   constantsBoard       from 'constants/board'                      ;
import   selectorsBoard       from 'selectors/board'                      ;
import   selectorsGame        from 'selectors/game'                       ;
import   toolsRules           from 'tools/rules'                          ;
import   toolsArray           from 'tools/array'                          ;

const cardClassName   = 'card'    ;
const holderClassName = 'holder'  ;

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hovered   : {} ,        // подсвечиваемая в процессе dnd-перетаскивания цель
      selected  : undefined , // выбранная Source-карта
      declined  : undefined , // ошибка выбора Source/Target карты или холдера
      shifted   : {}          // id смещенных вручную через dnd карт и их реальные координаты на момент дропа
    };
  }

  // FIXME проверить этот код () на оригинальном реакте
  getBoardRef(element)  { this.boardRef = element }
  getDeckRef(component) { this.deckRef = component ? component.base : null }
  getOpenRef(component) { this.openRef = component ? component.base : null } 
  getStackRef(index)    { return function(component) { this['stack'+index+'Ref']  = component ? component.base : null }}
  getHomeRef(index)     { return function(component) { this['home'+index+'Ref']   = component ? component.base : null }}  
  getCardRef(id)        { return function(component) { this['card'+id+'Ref']      = component ? (component.base || component.getWrappedInstance().Ref) : null }};

  hasChildrenCards(element) {
    return !!element.querySelector('.card');
  }

  // WARN Из-за недоработки в preact, вместо ключей используем сортировку по id.
  // Как только в cards появятся ключи, сразу начнутся ремаунты вместо обновлений.
  // Читать https://github.com/developit/preact/issues/797#issuecomment-321514661.
  buildCards(holderId, source, ref) {
    return source.map(function(card, index, all) {
      return (
        <Card 
          declined      = {this.state.declined === card.id}
          hovered       = {this.state.hovered[card.id] || ''}
          className     = {cardClassName}
          dndEnabled    = {this.props.fx.dndEnabled}
          isUpper       = {index === (all.length - 1)}
          holderId      = {holderId}
          card          = {card}
          flip          = {!card.flip}
          id            = {card.id}
          index         = {index}
          mini          = {this.props.fx.mini}
          parentElement = {ref}
          shifted       = {this.state.shifted[card.id]}
          ref           = {this.getCardRef(card.id).bind(this)}
          selected      = {this.state.selected === card.id}
        />
      );
    }.bind(this));
  }

  buildHolder(cards, id, ref, className) {
    return (
      <Holder 
        hovered       = {this.state.hovered[id] || ''}
        dndEnabled    = {this.props.fx.dndEnabled}
        cards         = {cards}
        declined      = {this.state.declined === id}
        ref           = {ref.bind(this)}
        id            = {id}
        className     = {className + ' ' + holderClassName}
      />      
    );
  }

  render() {
    var deckCards   = this.buildCards(constantsBoard.places.DECK, this.props.deckCards, this.deckRef);
    var openCards   = this.buildCards(constantsBoard.places.OPEN, this.props.openCards, this.openRef);
    var homesCards  = [];
    var stacksCards = [];
    
    for (var i = 1; i <= 4; i++) {
      homesCards.push(this.buildCards(constantsBoard.places['HOME'+i], this.props['home'+i+'Cards'], this['home'+i+'Ref']));
    }
    for (var i = 1; i <= 7; i++) {
      stacksCards.push(this.buildCards(constantsBoard.places['STACK'+i], this.props['stack'+i+'Cards'], this['stack'+i+'Ref'], true));
    }

    // WARN Из-за недоработки в preact, вместо ключей используем сортировку по id.
    // Как только в cards появятся ключи, сразу начнутся ремаунты вместо обновлений.
    // Читать https://github.com/developit/preact/issues/797#issuecomment-321514661.
    let cards = []
      .concat(deckCards)
      .concat(openCards)
      .concat(toolsArray.flatten(homesCards))
      .concat(toolsArray.flatten(stacksCards))
      .sort(function(a, b) {
        return a.props.id.localeCompare(b.props.id);
      }
    );

    /**
     * Данные для передачи в Source/Target-компоненты.
     */
    let selector = `.${cardClassName} ,.${holderClassName}`;
    let sourceAPI = {
      cardFlush     : API.cardFlush.bind(this),     // если отпустили карту не в дропзоне, надо вернуть ее на место

      // методы надо назвать более APIшно, здесь уже нет кликов/тапов и прочего UI-related
      deckCardClick : API.deckCardClick.bind(this),
      cardSelectOk  : API.cardSelectOk.bind(this),
      alertFlash         : API.alertFlash.bind(this),
      deckClick     : API.deckClick.bind(this)
    };
    let targetAPI = {
      cardSelectCancel  : API.cardSelectCancel.bind(this),
      cardDoubleClick   : API.cardDoubleClick.bind(this),
      cardMove          : API.cardMove.bind(this),
      cardFlush         : API.cardFlush.bind(this),     // если отпустили карту в недопустимой дропзоне, надо вернуть ее на место
      cardShift         : API.cardShift.bind(this),
      cardsUnshift      : API.cardsUnshift.bind(this),
      alertFlash        : API.alertFlash.bind(this), // 123
      targetHover       : API.targetHover.bind(this),
      targetUnhover     : API.targetUnhover.bind(this),
    };

    let backgroundAPI = {
      cardSelectCancel  : API.cardSelectCancel.bind(this)
    }


    return (
      <div id="board" ref={this.getBoardRef.bind(this)} className={this.props.disabled ? "disabled" : null}>
        <Background selected={this.state.selected} api={backgroundAPI} selector={this.boardRef} ignoreSelector={selector}/>
        <Source selected={this.state.selected} api={sourceAPI} dndEnabled={this.props.fx.dndEnabled} selector={selector}/>
        <Target selected={this.state.selected} api={targetAPI} dndEnabled={this.props.fx.dndEnabled} selector={selector}/>
        <div className="row">
          {this.buildHolder(this.props.deckCards, constantsBoard.places.DECK, this.getDeckRef, "deck")}
          {this.buildHolder(this.props.openCards, constantsBoard.places.OPEN, this.getOpenRef, "open")}
          <Status />
          {this.buildHolder(this.props.home1Cards, constantsBoard.places.HOME1, this.getHomeRef(1), "home")}
          {this.buildHolder(this.props.home2Cards, constantsBoard.places.HOME2, this.getHomeRef(2), "home")}
          {this.buildHolder(this.props.home3Cards, constantsBoard.places.HOME3, this.getHomeRef(3), "home")}
          {this.buildHolder(this.props.home4Cards, constantsBoard.places.HOME4, this.getHomeRef(4), "home")}
        </div>
        <div className="row">
          {this.buildHolder(this.props.stack1Cards, constantsBoard.places.STACK1, this.getStackRef(1), "stack")}
          {this.buildHolder(this.props.stack2Cards, constantsBoard.places.STACK2, this.getStackRef(2), "stack")}
          {this.buildHolder(this.props.stack3Cards, constantsBoard.places.STACK3, this.getStackRef(3), "stack")}
          {this.buildHolder(this.props.stack4Cards, constantsBoard.places.STACK4, this.getStackRef(4), "stack")}
          {this.buildHolder(this.props.stack5Cards, constantsBoard.places.STACK5, this.getStackRef(5), "stack")}
          {this.buildHolder(this.props.stack6Cards, constantsBoard.places.STACK6, this.getStackRef(6), "stack")}
          {this.buildHolder(this.props.stack7Cards, constantsBoard.places.STACK7, this.getStackRef(7), "stack")}
        </div>
        <div className="cards">
          {cards}
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  let game = selectorsGame.getCurrentGame(state);

  return {
    deckCards       : selectorsBoard.getDeckCards(state),
    openCards       : selectorsBoard.getOpenCards(state),
    stack1Cards     : selectorsBoard.getStack1Cards(state),
    stack2Cards     : selectorsBoard.getStack2Cards(state),
    stack3Cards     : selectorsBoard.getStack3Cards(state),
    stack4Cards     : selectorsBoard.getStack4Cards(state),
    stack5Cards     : selectorsBoard.getStack5Cards(state),
    stack6Cards     : selectorsBoard.getStack6Cards(state),
    stack7Cards     : selectorsBoard.getStack7Cards(state),
    home1Cards      : selectorsBoard.getHome1Cards(state),
    home2Cards      : selectorsBoard.getHome2Cards(state),
    home3Cards      : selectorsBoard.getHome3Cards(state),
    home4Cards      : selectorsBoard.getHome4Cards(state),
    fx              : state.fx,
    board           : state.board,
    disabled        : (game === undefined) || !game.controlsEnabled
  };
}

const mapDispatchToProps = function(dispatch) {
  return {
    deckCardClick    : bindActionCreators(actionsBoard.deckCardClick     , dispatch),
    madeMove         : bindActionCreators(actionsBoard.madeMove          , dispatch),
    deckClick        : bindActionCreators(actionsBoard.deckClick         , dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);