import   React                from 'react'                    ;
import   interact             from 'interactjs'               ;
import { bindActionCreators } from 'redux'                    ;
import { connect }            from 'react-redux'              ;

import   Card                 from 'components/board/card'    ;
import   Holder               from 'components/board/holder'  ;
import   Status               from 'components/board/status'  ;

import   actionsBoard         from 'actions/board'            ;
import   constantsBoard       from 'constants/board'          ;
import   selectorsBoard       from 'selectors/board'          ;
import   selectorsGame        from 'selectors/game'           ;

const flatten = function(array2d) {
  return [].concat.apply([], array2d);
};

class Board extends React.Component {
  componentDidMount() {
    let ir = interact(this.refs['board']);
    ir.on('tap', this.handleClick.bind(this));
  }

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
      if (this.props.board.selected[selectedIds[i]] === constantsBoard.highlights.ACCEPT) {
        selectedId = selectedIds[i];
        break;
      }
    }

    if (!selectedId) {
      if (target.classList.contains('card')) {
        let card = this.props.board.cards.byId[target.dataset['id']];
        if (card.holderId === constantsBoard.places.DECK) {
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
      if (this.props.board.selected[target.dataset['id']] === constantsBoard.highlights.ACCEPT) {
        console.log('повторный клик на выбранную карту - раньше это был дабл-клик хэндлер');
        this.handleDoubleClick(event);
      } else if (this.props.board.selected[target.dataset['id']] === constantsBoard.highlights.DENY) {
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

    let card = this.props.board.cards.byId[target.dataset['id']];
    if (((card.holderId === constantsBoard.places.OPEN) || constantsBoard.isStackPlace(card.holderId)) && (!this.hasChildrenCards(target))) {
      this.props.cardDoubleClick(card.id);
    }
  }

  buildCards(source, ref, isStack) {
    return source.map(function(card, index) {
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
    var deckCards   = this.buildCards(this.props.deckCards, this.deckRef);
    var openCards   = this.buildCards(this.props.openCards, this.openRef);
    var homesCards  = [];
    var stacksCards = [];
    
    for (var i = 1; i <= 4; i++) {
      homesCards.push(this.buildCards(this.props['home'+i+'Cards'], this['home'+i+'Ref']));
    }
    for (var i = 1; i <= 7; i++) {
      stacksCards.push(this.buildCards(this.props['stack'+i+'Cards'], this['stack'+i+'Ref'], true));
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
      <div id="board" ref="board" className={this.props.disabled ? "disabled" : null}>
        <div className="row">
          <Holder ref={this.getDeckRef.bind(this)} id="d" className="deck"/>
          <Holder ref={this.getOpenRef.bind(this)} id="o" className="open"/>
          <Status />
          <Holder ref={this.getHomeRef(1).bind(this)} id="h1" className="home"/>
          <Holder ref={this.getHomeRef(2).bind(this)} id="h2" className="home"/>
          <Holder ref={this.getHomeRef(3).bind(this)} id="h3" className="home"/>
          <Holder ref={this.getHomeRef(4).bind(this)} id="h4" className="home"/>
        </div>
        <div className="row">
          <Holder ref={this.getStackRef(1).bind(this)} id="s1" className="stack"/>
          <Holder ref={this.getStackRef(2).bind(this)} id="s2" className="stack"/>
          <Holder ref={this.getStackRef(3).bind(this)} id="s3" className="stack"/>
          <Holder ref={this.getStackRef(4).bind(this)} id="s4" className="stack"/>
          <Holder ref={this.getStackRef(5).bind(this)} id="s5" className="stack"/>
          <Holder ref={this.getStackRef(6).bind(this)} id="s6" className="stack"/>
          <Holder ref={this.getStackRef(7).bind(this)} id="s7" className="stack"/>
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
    cardDoubleClick  : bindActionCreators(actionsBoard.cardDoubleClick   , dispatch),
    cardDrop         : bindActionCreators(actionsBoard.cardDrop          , dispatch),
    cardSelectCancel : bindActionCreators(actionsBoard.cardSelectCancel  , dispatch),
    deckClick        : bindActionCreators(actionsBoard.deckClick         , dispatch),
    cardSelectOk     : bindActionCreators(actionsBoard.cardSelectOk      , dispatch),
    cardSelectFail   : bindActionCreators(actionsBoard.cardSelectFail    , dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);