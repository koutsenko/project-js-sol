import   createCachedSelector from 're-reselect'      ;
import { createSelector }     from 'reselect'         ;

import   constantsBoard       from 'constants/board'  ;

const getCards = (state) => state.board.cards.byId;

/**
 * Селектор возвращающий holderId заданной карты.
 * Вернет undefined, если холдер не нашелся (например такое случится если cardId на самом деле не id карты)
 */
const getHolderId = function(cardId, boardState) {
  var holderIds = boardState.holders.allIds;
  var holderId;

  for (var i = 0; i < holderIds.length; i++) {
    if (boardState.holders.byId[holderIds[i]].indexOf(cardId)+1) {
      holderId = holderIds[i];
      break;
    }
  }

  return holderId;
}

const getHolderCards = createCachedSelector(
  (state, holderId) => state.board.holders.byId[holderId],
  (state) => state.board.cards,
  (holder, cards) => holder.map(function(cardId) {
    return cards.byId[cardId];
  })
)(
  (state, holderId) => holderId
);

const getNonDeckCards   = function(state) {
  let holderIds   = state.board.holders.allIds.slice();
  let cards       = [];

  holderIds.splice(holderIds.indexOf(constantsBoard.places.DECK), 1);
  holderIds.forEach(function(holderId) {
    cards = cards.concat(state.board.holders.byId[holderId]);
  });

  return cards;
};
const getLastCards      = function(boardState) {
  return boardState.holders.allIds.map(function(holderId) {
    return boardState.holders.byId[holderId][boardState.holders.byId[holderId].length - 1];
  });
};
/**
 * Селектор возвращающий самую верхнюю карту холдера или undefined холдер пустой.
 * На входе id холдера
 * @param {*} holderId
 * @param {*} boardState
 */
const getLastCard       = function(holderId, boardState) {
  let holder = boardState.holders.byId[holderId];

  return (holder && holder.length) ? holder[holder.length - 1] : undefined;
};

const getChildCards     = function(cardId, boardState) {
  let result;
  let holderId = getHolderId(cardId, boardState);

  if (constantsBoard.isStackPlace(holderId)) {
    let holder      = boardState.holders.byId[holderId];
    let startIndex  = holder.indexOf(cardId);
    let endIndex    = holder[holder.length];
    result = holder.slice(startIndex, endIndex);
  } else {
    result = [cardId];
  }

  return result;
};

const getLowerFlips      = function(state, cardId) {
  let holder = state.board.holders.byId[getHolderId(cardId, state.board)];

  return holder.filter(function(id) {
    return holder.indexOf(id) <= holder.indexOf(cardId);
  }).map(function(id) {
    return state.board.cards.byId[id].flip;
  });
};

const getCardIndex      = function(state, cardId) {
  let holderId = getHolderId(cardId, state.board);
  let holder = state.board.holders.byId[holderId];

  return holder.indexOf(cardId);
};

const resultFunc = (ids, cards) => ids.map((id) => cards[id]);

const resultFunc2 = (id) => id;

export default {
  getNonDeckCards     : createSelector([getNonDeckCards , getCards ] , resultFunc),
  getHolderId         : createSelector([getHolderId   ] , resultFunc2),
  getLastCards        : createSelector([getLastCards  ] , resultFunc2),
  getLastCard         : createSelector([getLastCard   ] , resultFunc2),
  getChildCards       : createSelector([getChildCards ] , resultFunc2),
  getLowerFlips       : createSelector([getLowerFlips ] , resultFunc2),
  getCardIndex        : createSelector([getCardIndex  ] , resultFunc2),
  getHolderCards      : getHolderCards
};
