/* eslint-disable func-names */
import   selectorsTurn  from 'selectors/turn'   ;
import   toolsRules     from 'tools/rules'      ;
import   constantsBoard from 'constants/board'  ;

/**
 * Здесь что-то типа action creators, но для setState а не для dispatch.
 */

const cardDoubleClick = function(source_card_id) {
  const map = toolsRules.getHomeMap(this.props.turn);
  let found = false;

  Object.keys(map).forEach(function(index) {
    if (map[index] === source_card_id) {
      found = true;
      cardSelectCancel.call(this);
      this.props.madeMove(source_card_id, constantsBoard.getHomePlace(parseInt(index)))
    }
  }, this);

  if (!found) {
    alertFlash.call(this, source_card_id);
  }
};

const deckCardClick = function() {
  this.props.deckCardClick();
};

const deckClick = function() {
  this.props.deckClick();
};

const cardSelectCancel = function() {
  this.setState({
    selected: undefined
  });
};

const cardSelectOk = function(id) {
  this.setState({
    selected: id
  });
};

/**
 * Вызывается при событиях дропа на таргет и при клике на таргет.
 */
const cardMove = function(source_card_id, target_id) {
  // FIXME что здесь делают эти выборки? Тот кто вызвал cardMove уже всё вычислил!
  const boardState        = this.props.turn;
  const target_holder_id  = selectorsTurn.getHolderId(boardState, target_id) || target_id;

  this.props.madeMove(source_card_id, target_holder_id);
};

/**
 *
 */
const cardShift = function(cardIds, els, dx, dy) {
  if (!Object.keys(this.state.shifted).length) {
    const initial = {};
    const shifted = {};

    cardIds.forEach(function(id) {
      const rect = els[id].getBoundingClientRect();
      // let sl = window.pageXOffset || document.documentElement.scrollLeft;
      // let st = window.pageYOffset || document.documentElement.scrollTop;
      const x0 = this.props.fx.layout.size.l// - sl;
      const y0 = this.props.fx.layout.size.t// - st;
      initial[id] = [Math.round(rect.left-x0), Math.round(rect.top-y0)];
      shifted[id] = [0, 0];
    }, this);

    this.setState({ initial, shifted });
  }

  cardIds.forEach(function(id) {
    this.state.shifted[id][0] += dx;
    this.state.shifted[id][1] += dy;

    const x = this.state.initial[id][0] + this.state.shifted[id][0];
    const y = this.state.initial[id][1] + this.state.shifted[id][1];

    els[id].style.webkitTransform = els[id].style.transform = `translate(${x}px,${y}px)`;
  }, this);
};

const cardUnshift = function() {
  this.setState({
    shifted: {},
    initial: {}
  });
};

const alertFlash = function(id) {
  this.setState({
    declined: id
  });
  // FIXME таймаут надо взять из констант.
  setTimeout(() => {
    this.setState({
      declined: undefined
    });
  }, 500);
};

const targetHover = function(id, highlight) {
  this.setState({
    hovered: {
      [id]: highlight
    }
  });
};

const targetUnhover = function() {
  this.setState({
    hovered: {}
  });
};

export default {
  cardDoubleClick,
  deckCardClick,
  deckClick,
  cardSelectCancel,
  cardSelectOk,
  cardMove,
  cardShift,
  cardUnshift,
  alertFlash,
  targetHover,
  targetUnhover
}
