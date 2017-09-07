import { bindActionCreators } from 'redux'            ;
import { connect }            from 'react-redux'      ;
import   interact             from 'interactjs'       ;
import   React                from 'react'            ;
import   ReactDOM             from 'react-dom'        ;

import   constantsBoard       from 'constants/board'  ;
import   selectorsBoard       from 'selectors/board'  ;
import   toolsRules           from 'tools/rules'      ;

/**
 * Компонент-часть Board без своей видимой DOM составляющей.
 * Отвечает за управление элементами-источниками.
 * Поддерживается DragSource-часть Drag'n'Drop и тапы/клики.
 */
class Source extends React.Component {
  constructor(props) {
    super(props);

    this.ir = interact(this.props.selector);
    this.ir.styleCursor(false);
    this.ir.on('tap', this.tapHandler.bind(this));
    
    this.irDrag = interact(this.props.selector);
    this.irDrag.styleCursor(false);
    this.toggleDnd(this.props.dndEnabled);

    this.state = {
      moving  : {}  // хранилище координат и ссылок на HTMLElement двигаемых карт
    }; 
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.props.dndEnabled !== nextProps.dndEnabled) {
      this.toggleDnd(nextProps.dndEnabled);
    }
  }
  
  toggleDnd(state) {
    if (state) {
      this.irDrag.draggable({
        onstart : this.onDragStart.bind(this),
        onmove  : this.onDragMove.bind(this),
        onend   : this.onDragEnd.bind(this),
      });
    } else {  
      this.irDrag.onstart = null;
      this.irDrag.onmove  = null;
      this.irDrag.onend   = null;
      this.irDrag.draggable(false);
    }
  }

  onDragStart(event) {
    let id = event.target.dataset['id'];
    if (this.props.selected || !constantsBoard.isCard(id) || !toolsRules.isAllowableCard(id, this.props.board)) {
      interact.stop(event);
      this.props.api.alertFlash(id);
      return;
    }

    console.log('стартуем драг-н-дроп, сохраняем стартовые характеристики элемента', event.target);
    
    let cardIds = selectorsBoard.getChildCards(id, this.props.board);
    
    //debugging
    console.log(cardIds);
  
    cardIds.forEach(function(cardId) {
      let el = event.target.parentElement.querySelector('[data-id="'+cardId+'"]');

      this.state.moving[cardId] = {
        el : el,
        X  : parseInt(el.dataset['x0']) ,
        Y  : parseInt(el.dataset['y0']) ,
        R  : parseInt(el.dataset['r0']) ,
        Z  : parseInt(el.dataset['z0'])
      };

      el.style.zIndex = this.state.moving[cardId].Z + 100;
    }, this);
  }
  
  onDragMove(event) {
    console.log('наращиваем дельту и двигаем');
    Object.keys(this.state.moving).forEach(function(cardId) {
      let el = this.state.moving[cardId].el;

      this.state.moving[cardId].X += event.dx;
      this.state.moving[cardId].Y += event.dy;
      
      el.style.transform = el.style.webkitTransform = `translate(${this.state.moving[cardId].X}px,${this.state.moving[cardId].Y}px) rotate(${this.state.moving[cardId].R}deg)`;
    }.bind(this));
  }

  onDragEnd(event) {
    console.log('закончили двигать');

    if (event.interaction.dropTarget === null) {
      console.log('это не дроп - поэтому вручную возвращаем карты');
      this.props.api.cardFlush(event.target);
    }
    this.state.moving = {};
  }

  isTappable() {
    return this.props.selected === undefined;
  }

  tapHandler(event) {
    if (this.isTappable()) {
      console.log('source tapped');
      let id = event.target.dataset['id'];

      if (constantsBoard.isCard(id)) {
        if (!toolsRules.isAllowableCard(id, this.props.board)) {
          this.props.api.alertFlash(id);
        } else {
          let holderId = selectorsBoard.getHolderId(id, this.props.board);
          if (holderId === constantsBoard.places.DECK) {
            this.props.api.deckCardClick();
          } else {
            this.props.api.cardSelectOk(id);
          }
        }
      } else {
        if (id === constantsBoard.places.DECK) {
          this.props.api.deckClick();
        } else {
          this.props.api.alertFlash(id);
        }
      }
    } else {
      console.log('source tapped but ignored, because it is disabled');
    }
  }

  render() {
    return null;
  }
};

Source.propTypes = {
  selected      : React.PropTypes.string,  /** Ранее выбранные source-цели, нужны для обработчика тапов */  
  selector      : React.PropTypes.string.isRequired,
  dndEnabled    : React.PropTypes.bool.isRequired,
  api           : React.PropTypes.object.isRequired
};

const mapStateToProps = function(state) {
  return state;
};

export default connect(mapStateToProps, null, null, { withRef: true })(Source);