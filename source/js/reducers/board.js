import shuffleSeed      from 'knuth-shuffle-seeded' ;

import constantsActions from '../constants/actions' ;
import constantsBoard   from '../constants/board'   ;

function cardMove(action, newState, raw) {
  var source_card     = newState.cards.byId[action.card_id];
  var source_type     = source_card.holderId;
  var source_holder   = newState.holders.byId[source_type];

  var target_type     = action.target_type;
  var target_index    = action.target_index;
  var target_holder   = newState.holders.byId[target_type];
  
  var card_ids = constantsBoard.isStackPlace(source_type) ? source_holder.slice(source_holder.indexOf(action.card_id), source_holder.length) : [action.card_id];
  card_ids.forEach(function(id) {
    var card = newState.cards.byId[id];
    card.touched = !raw ? true : card.touched;
    card.holderId = target_type;
    card.flip = raw ? action.flip : ((target_type === constantsBoard.places.OPEN) ? false : card.flip);
    source_holder.splice(source_holder.indexOf(id), 1);
    target_holder.push(id);
  });

  if (!raw && constantsBoard.isStackPlace(source_type) && source_holder.length) {
    newState.cards.byId[source_holder[source_holder.length-1]].flip = false;
  }

  return newState;
}

/**
 * Редьюсер, работающий с состоянием игры (игрового поля, она же доска) в данный ход.
 */
export default function(state, action) {
  if (state === undefined) {
    state = buildBoard();
  }

  switch(action.type) {
    case constantsActions.CARD_SELECT_CANCEL_BY_PLAYER:
      var newState = JSON.parse(JSON.stringify(state));
      newState.selected = {};
      return newState;

    case constantsActions.CARD_SELECT_OK_BY_PLAYER:
      var newState = JSON.parse(JSON.stringify(state));
      newState.selected[action.id] = constantsBoard.highlights.ACCEPT;
      return newState;

    case constantsActions.CARD_SELECT_FAIL_BY_PLAYER:
      var newState = JSON.parse(JSON.stringify(state));
      newState.selected[action.id] = constantsBoard.highlights.DENY;
      return newState;

    case constantsActions.CARD_TARGET_WRONG_BY_PLAYER:
      var newState = JSON.parse(JSON.stringify(state));
      newState.declined = action.holder_id;
      return newState;

    case constantsActions.FLUSH_DECLINE:
      var newState = JSON.parse(JSON.stringify(state));
      newState.declined = undefined;
      return newState;

    case constantsActions.FLUSH_WRONG_HIGHLIGHT:
      var newState = JSON.parse(JSON.stringify(state));
      newState.selected = {};
      return newState;
    
    case constantsActions.REVERT:
      var newState = JSON.parse(JSON.stringify(state.previous));
      newState.index    = newState.index + 2;
      newState.previous = undefined;
      return newState;

    case constantsActions.LOAD_SCENARIO:
      return loadBoard(action.data);

    case constantsActions.GAME_CREATED:
      return buildBoard(action.seed);

    case constantsActions.CARD_BACK_BY_PLAYER:
      var newState = JSON.parse(JSON.stringify(state));
      var deck = newState.holders.byId[constantsBoard.places.DECK];
      var open = newState.holders.byId[constantsBoard.places.OPEN];
      open.forEach(function(id) {
        let card = newState.cards.byId[id];
        card.flip = true;
        card.touched = true;
        card.holderId = constantsBoard.places.DECK;
        deck.unshift(id);
      }, this);
      newState.holders.byId[constantsBoard.places.OPEN] = [];
      newState.previous = JSON.parse(JSON.stringify(state));
      newState.index++;
      return newState;

    case constantsActions.CARD_MOVE_BY_ENGINE:
      var newState = JSON.parse(JSON.stringify(state));
      return cardMove(action, newState, true);

    case constantsActions.CARD_MOVE_BY_PLAYER:
      var newState = JSON.parse(JSON.stringify(state));
      newState.previous = JSON.parse(JSON.stringify(state));
      newState.selected = {};
      newState.index++;
      return cardMove(action, newState);
  }

  return state;
};

const buildBoard = function(seed) {
  let deck = buildDeck(seed || 'test');
  let holders = buildHolders({
    [constantsBoard.places.DECK]: deck
  });
  let cards   = buildCards(deck);

  return {
    declined  : undefined,  // карта или холдер, которые хотели выбрать, но не получилось...
    selected  : {},         // корректно и некорректно выбранные карты
    index     : 0,          // этот ход имеет определенный номер в игре.
    previous  : undefined,  // ссылка на копию самого себя (кроме previous - память ограничена 1-м ходом назад)
    cards     : cards,      // ассоциативный массив объектов карт
    holders   : holders     // ассоциативный массив объектов стопок карт
  };
}

/**
 * Генератор списка холдеров и id хранящихся в них карт
 * @param {*} byIds 
 */
const buildHolders = function(byIds) {
  let holders = {
    byId    : {},
    allIds  : []
  };

  holders.allIds = Object.keys(constantsBoard.places);
  holders.allIds.forEach(function(holder) {
    holders.byId[holder] = [];
  });
  holders.byId = Object.assign(holders.byId, byIds);

  return holders;
};

/**
 * Генератор перетасованного списка id карт, для холдера-колоды 
 * @param {*} seed 
 */
const buildDeck = function(seed) {
  let deck = [];
  let suits = constantsBoard.suits;
  let ranks = constantsBoard.ranks;

  ranks.forEach(function(rank) {
    suits.forEach(function(suit) {
      deck.push(rank+suit);
    });
  });

  return shuffleSeed(deck, seed);
};

/**
 * Генератор списка и объктов карт 
 * @param {*} deck 
 */
const buildCards = function(deck) {
  let cards = {
    byId: {},
    allIds: {}
  };

  cards.allIds = deck;
  cards.allIds.forEach(function(id, index) {
    cards.byId[id] = buildCard(id, true, constantsBoard.places.DECK);
  });

  return cards;
};

const loadBoard = function(data) {
  // Обрати внимание, что при загрузке расклада параметры touched будут везде false. Я пока не понял как правильнее.
  let save = JSON.parse(decodeURI(data));
  let board = save.board;
  let opened = save.opened;  // ids открытых карт стеков
  let holders = board.holders;
  let index = board.index;

  let cards = {
    byId: {},
    allIds: []
  };
  holders.allIds.forEach(function(key) {
    holders.byId[key].forEach(function(id, index) {
      let flip = opened.indexOf(id) < 0;
      cards.byId[id] = buildCard(id, flip, key);
      cards.allIds.push(id);
    });
  });

  return {
    cards     : cards,
    holders   : holders,
    index     : index,
    previous  : undefined,
    selected  : {}
  };
}

const buildCard = function(id, flipped, holderId) {
  return {
    id        : id        ,
    rank      : id[0]     ,
    suit      : id[1]     ,
    flip      : flipped   ,
    touched   : false     ,
    holderId  : holderId
  };
};