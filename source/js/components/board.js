import   React                from 'react'                                ;
import   interact             from 'interactjs'                           ;
import { bindActionCreators } from 'redux'                                ;
import { connect }            from 'react-redux'                          ;

import   API                  from 'components/board/api'                 ;
import   Card                 from 'components/board/card'                ;
import   Holder               from 'components/board/holder'              ;
import   Status               from 'components/board/status'              ;
import   Watermark            from 'components/board/watermark'           ;

import   Background           from 'components/board/listener/background' ;
import   Source               from 'components/board/listener/source'     ;
import   Target               from 'components/board/listener/target'     ;

import   actionsBoard         from 'actions/board'                        ;
import   constantsBoard       from 'constants/board'                      ;
import   selectorsBoard       from 'selectors/board'                      ;
import   selectorsGame        from 'selectors/game'                       ;
import   selectorsLayout      from 'selectors/layout'                     ;
import   toolsRules           from 'tools/rules'                          ;
import   toolsArray           from 'tools/array'                          ;
import   constantsLayout      from 'constants/layout'                     ;

/**
 * Временно генерация небрежностей для карт перемещена в <Board>
 * По причине необходимости знать их уже на этапе биндинга свойств <Card>.
 */
const randomize = function(dispersion) {
  return Math.round((Math.random()-0.5) * dispersion);
};
const generateDeltas = function() {
  return {
    x: randomize(9), // это теперь проценты!
    y: randomize(9), // это теперь проценты!
    r: randomize(5)   // это градусы как и было
  };
};

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      deltas    : {}        , // { cardId : deltas-погрешности }
      hovered   : {}        , // подсвечиваемая в процессе dnd-перетаскивания цель
      selected  : undefined , // выбранная Source-карта
      declined  : undefined , // ошибка выбора Source/Target карты или холдера
      initial   : {}        , // начальные координаты карт до смещения (FIXME вероятно их тоже надо прокидывать в <Card>?)
      shifted   : {}          // id смещенных вручную через dnd карт и их реальные координаты на момент дропа
    };
  }

  // WARN Из-за недоработки в preact, вместо ключей используем сортировку по id.
  // Как только в cards появятся ключи, сразу начнутся ремаунты вместо обновлений.
  // Читать https://github.com/developit/preact/issues/797#issuecomment-321514661.
  buildCards(holderId, source) {
    return source.map(function(card, index, all) {
      let deltas = this.state.deltas[card.id];
      if (!deltas) {
        deltas = generateDeltas();
        this.state.deltas[card.id] = deltas;
      }
      return (
        <Card
          deltas        = {deltas}
          declined      = {this.state.declined === card.id}
          hovered       = {this.state.hovered[card.id] || ''}
          className     = {constantsLayout.cardClassName}
          flip          = {!card.flip}
          id            = {card.id}
          shifted       = {this.state.shifted[card.id]}
          selected      = {this.state.selected === card.id}
          ownerId       = {holderId}
          indexInOwner  = {index}
        />
      );
    }.bind(this));
  }

  buildHolder(id) {
    return (
      <Holder
        hovered       = {this.state.hovered[id] || ''}
        declined      = {this.state.declined === id}
        id            = {id}
        className     = {constantsLayout.holderClassName}
      />
    );
  }

  render() {
    var deckCards   = this.buildCards(constantsBoard.places.DECK, this.props.holderCards(constantsBoard.places.DECK));
    var openCards   = this.buildCards(constantsBoard.places.OPEN, this.props.holderCards(constantsBoard.places.OPEN));
    var homesCards  = [];
    var stacksCards = [];

    for (var i = 1; i <= 4; i++) {
      homesCards.push(this.buildCards(constantsBoard.places['HOME'+i], this.props.holderCards(constantsBoard.places['HOME'+i])));
    }
    for (var i = 1; i <= 7; i++) {
      stacksCards.push(this.buildCards(constantsBoard.places['STACK'+i], this.props.holderCards(constantsBoard.places['STACK'+i])));
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
    let selector = `.${constantsLayout.cardClassName} ,.${constantsLayout.holderClassName}`;
    let cancelSelector = `#${constantsLayout.boardIdName}`;
    let sourceAPI = {
      // методы надо назвать более APIшно, здесь уже нет кликов/тапов и прочего UI-related
      cardShift     : API.cardShift.bind(this),
      cardUnshift   : API.cardUnshift.bind(this),
      deckCardClick : API.deckCardClick.bind(this),
      cardSelectOk  : API.cardSelectOk.bind(this),
      alertFlash    : API.alertFlash.bind(this),
      deckClick     : API.deckClick.bind(this)
    };
    let targetAPI = {
      cardSelectCancel  : API.cardSelectCancel.bind(this),
      cardDoubleClick   : API.cardDoubleClick.bind(this),
      cardMove          : API.cardMove.bind(this),
      cardShift         : API.cardShift.bind(this),
      cardUnshift       : API.cardUnshift.bind(this),
      alertFlash        : API.alertFlash.bind(this),
      targetHover       : API.targetHover.bind(this),
      targetUnhover     : API.targetUnhover.bind(this),
    };

    let backgroundAPI = {
      cardSelectCancel  : API.cardSelectCancel.bind(this)
    }


    return (
      <div id={constantsLayout.boardIdName} className={this.props.disabled ? "disabled" : null}>
        <Background selected={this.state.selected} api={backgroundAPI} selector={cancelSelector} ignoreSelector={selector}/>
        <Source selected={this.state.selected} api={sourceAPI} dndEnabled={this.props.fx.dndEnabled} selector={selector}/>
        <Target selected={this.state.selected} api={targetAPI} dndEnabled={this.props.fx.dndEnabled} selector={selector}/>
        {this.buildHolder(constantsBoard.places.DECK)}
        {this.buildHolder(constantsBoard.places.OPEN)}
        <Status />
        {this.buildHolder(constantsBoard.places.HOME1)}
        {this.buildHolder(constantsBoard.places.HOME2)}
        {this.buildHolder(constantsBoard.places.HOME3)}
        {this.buildHolder(constantsBoard.places.HOME4)}
        {this.buildHolder(constantsBoard.places.STACK1)}
        {this.buildHolder(constantsBoard.places.STACK2)}
        {this.buildHolder(constantsBoard.places.STACK3)}
        {this.buildHolder(constantsBoard.places.STACK4)}
        {this.buildHolder(constantsBoard.places.STACK5)}
        {this.buildHolder(constantsBoard.places.STACK6)}
        {this.buildHolder(constantsBoard.places.STACK7)}
        <div className={constantsLayout.cardsClassName}>
          {cards}
        </div>
        <Watermark/>
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  let game = selectorsGame.getCurrentGame(state);

  return {
    holderCards  : function(holderId) {
      return selectorsBoard.getHolderCards(state, holderId)
    },
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
