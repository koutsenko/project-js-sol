import { bindActionCreators } from 'redux'            ;
import { connect }            from 'react-redux'      ;
import   interact             from 'interactjs'       ;
import   React                from 'react'            ;
import   ReactDOM             from 'react-dom'        ;

import   constantsBoard       from 'constants/board'  ;
import   selectorsTurn        from 'selectors/turn'   ;
import   toolsRules           from 'tools/rules'      ;

/**
 * Компонент-часть Board без своей видимой DOM составляющей.
 * Отвечает за управление элементами-источниками.
 * Поддерживается DragSource-часть Drag'n'Drop и тапы/клики.
 */
class Source extends React.PureComponent {
  constructor(props) {
    super(props);

    this.ir = interact(this.props.selector);
    this.ir.styleCursor(false);
    this.ir.on('tap', this.tapHandler.bind(this));

    this.irDrag = interact(this.props.selector);
    this.irDrag.styleCursor(false);
    this.toggleDnd(this.props.dndEnabled);

    this.state = {
      moving  : []  // хранилище id двигаемых карт
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
    if (this.props.selected || !constantsBoard.isCard(id) || !toolsRules.isAllowableCard(this.props.turn, id)) {
      interact.stop(event);
      this.props.api.alertFlash(id);
      return;
    }


    let cardIds = selectorsTurn.getChildCards(this.props.turn, id);
    // console.log('стартуем драг-н-дроп, двигать будем карты с id', cardIds);
    this.state.moving = cardIds;
    this.state.movingEls = {};
    cardIds.forEach(function(id) {
      this.state.movingEls[id] = event.target.parentElement.querySelector('[data-id="' + id + '"]');
    }.bind(this));
  }

  onDragMove(event) {
    // debug выключаем консоль (мешает)
    // console.log('наращиваем дельту и двигаем');
    this.props.api.cardShift(this.state.moving, this.state.movingEls, event.dx, event.dy);
  }


  onDragEnd(event) {
    // console.log('закончили двигать');


    if (event.interaction.dropTarget === null) {
      // console.log('это не дроп - поэтому вручную возвращаем карты');
      this.props.api.cardUnshift();
    }
    this.state.moving = {};
    this.state.movingEls = {};
  }

  isTappable() {
    return this.props.selected === undefined;
  }

  tapHandler(event) {
    if (this.isTappable()) {
      // console.log('source tapped');
      let id = event.target.dataset['id'];

      if (constantsBoard.isCard(id)) {
        if (!toolsRules.isAllowableCard(this.props.turn, id)) {
          this.props.api.alertFlash(id);
        } else {
          let holderId = selectorsTurn.getHolderId(this.props.turn, id);
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
      // console.log('source tapped but ignored, because it is disabled');
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

export default connect(mapStateToProps)(Source);