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
import   selectorsTurn        from 'selectors/turn'                       ;
import   selectorsGame        from 'selectors/game'                       ;
import   selectorsLayout      from 'selectors/layout'                     ;
import   toolsRules           from 'tools/rules'                          ;
import   toolsArray           from 'tools/array'                          ;
import   constantsLayout      from 'constants/layout'                     ;

class Board extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      hovered   : {}       , // подсвечиваемая в процессе dnd-перетаскивания цель
      selected  : undefined, // выбранная Source-карта
      declined  : undefined, // ошибка выбора Source/Target карты или холдера
      initial   : {}       , // начальные координаты карт до смещения (FIXME вероятно их тоже надо прокидывать в <Card>?)
      shifted   : {}         // id смещенных вручную через dnd карт и их реальные координаты на момент дропа
    };
  }

  // WARN Из-за недоработки в preact, вместо ключей используем сортировку по id.
  // Как только в cards появятся ключи, сразу начнутся ремаунты вместо обновлений.
  // Читать https://github.com/developit/preact/issues/797#issuecomment-321514661.
  buildCards(holderId, source) {
    return source.map(function(cardId, index, all) {
      let flipped = this.props.flipped.byId[holderId];
      let flips = selectorsTurn.getParentFlips(cardId, source, flipped);
      return (
        <Card
          deltas        = {this.props.cardSeeds[cardId]}
          declined      = {this.state.declined === cardId}
          hovered       = {this.state.hovered[cardId] || ''}
          className     = {constantsLayout.cardClassName}
          flips         = {flips}
          id            = {cardId}
          shifted       = {this.state.shifted[cardId]}
          selected      = {this.state.selected === cardId}
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
        // FIXME Возможно, какая-то проблема preact, проявляется только в работе по file://.
        if (!a.props || !b.props) {
          return a.attributes.id.localeCompare(b.attributes.id);
        }
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
  let game = selectorsGame.getCurrentGame(state.game);

  return {
    cardSeeds       : selectorsGame.getCardSeeds(game.seed),
    flipped         : state.turn.flipped,
    holderCards     : function(holderId) {
      return state.turn.holders.byId[holderId]
    },
    fx              : state.fx,
    turn            : state.turn,
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
