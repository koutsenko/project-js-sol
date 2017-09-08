import   selectorsBoard       from 'selectors/board'                  ;
import   toolsRules           from 'tools/rules'                      ;
import   constantsBoard       from 'constants/board'                  ;

/**
 * Здесь что-то типа action creators, но для setState а не для dispatch.
 */

const cardDoubleClick = function(source_card_id) {  
  let map = toolsRules.getHomeMap(this.props.board);
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
  let boardState        = this.props.board;
  let source_holder_id  = selectorsBoard.getHolderId(source_card_id, boardState);
  let target_holder_id  = selectorsBoard.getHolderId(target_id, boardState) || target_id;
  let target_card_id    = selectorsBoard.getLastCard(target_holder_id, boardState);

  this.props.madeMove(source_card_id, target_holder_id);
};

/**
 * Восстановление z-index и координат карты в соответствие с data-атрибутами.
 * Изменения были в связи с drag-n-drop.
 * Соответственно, восстановление нужно в случаях:
 * - "дропе" в пустую или неигровую область (source.js::L102)
 * - дропе в исходный же холдер (target.js::L120)
 * - дропе в недопустимую цель (target.js::L134)
 * - дропе в допустимую цель (нет, видимо делал отдельно, через cardShift/cardUnshift)
 */
const cardFlush = function(element) {
  let boardState = this.props.board;
  let cardId = element.dataset['id'];
  let cardIds = selectorsBoard.getChildCards(cardId, boardState);

  cardIds.forEach(function(id) {
    let el = element.parentElement.querySelector('[data-id="'+id+'"]');
    let x0 = parseInt(el.dataset['x0']);
    let y0 = parseInt(el.dataset['y0']);
    let r  = parseInt(el.dataset['r0']);
    let z  = parseInt(el.dataset['z0']);
    
    el.style.transform = el.style.webkitTransform = `translate(${x0}px,${y0}px) rotate(${r}deg)`;
    el.style.zIndex = z;
  });
};
  
/**
 * 
 */
const cardShift = function(element) {

  let cardId = element.dataset['id'];
  let parentEl = element.parentElement;

  let boardState = this.props.board;
  let cardIds = selectorsBoard.getChildCards(cardId, boardState);
  
  cardIds.forEach(function(id, index) {
      console.log(id);
      let el = parentEl.querySelector('[data-id="'+id+'"]');
      let rect = el.getBoundingClientRect();
      this.setState({
        shifted: Object.assign(this.state.shifted, {
          [id]: [rect.left, rect.top]
        })
      });
  }, this);
};
  
const cardsUnshift = function() {  
    this.setState({
      shifted: {}
    });
};

const alertFlash = function(id) {
  this.setState({
    declined: id
  });
  // FIXME таймаут надо взять из констант.
  setTimeout(function() {
    this.setState({
      declined: undefined
    });
  }.bind(this), 500);
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
  cardFlush,
  cardShift,
  cardsUnshift,

  alertFlash,
  targetHover,
  targetUnhover


}