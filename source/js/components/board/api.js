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
 * 
 */
const cardShift = function(cardIds, dx, dy) {
  cardIds.forEach(function(id) {
      let oldx = 0, oldy = 0;
      if (this.state.shifted[id]) {
        oldx = this.state.shifted[id][0];
        oldy = this.state.shifted[id][1];
      }

      this.setState({
        shifted: Object.assign(this.state.shifted, {
          [id]: [oldx+dx, oldy+dy]
        })
      });
  }, this);
};
  
const cardUnshift = function() {  
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
  cardShift,
  cardUnshift,
  alertFlash,
  targetHover,
  targetUnhover
}