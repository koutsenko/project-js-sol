import { createSelector } from 'reselect'         ;

import   constantsBoard   from 'constants/board'  ;

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

const getDeckCardIds    = (state) => state.board.holders.byId[constantsBoard.places.DECK]   ;
const getOpenCardIds    = (state) => state.board.holders.byId[constantsBoard.places.OPEN]   ;
const getStack1CardIds  = (state) => state.board.holders.byId[constantsBoard.places.STACK1] ;
const getStack2CardIds  = (state) => state.board.holders.byId[constantsBoard.places.STACK2] ;
const getStack3CardIds  = (state) => state.board.holders.byId[constantsBoard.places.STACK3] ;
const getStack4CardIds  = (state) => state.board.holders.byId[constantsBoard.places.STACK4] ;
const getStack5CardIds  = (state) => state.board.holders.byId[constantsBoard.places.STACK5] ;
const getStack6CardIds  = (state) => state.board.holders.byId[constantsBoard.places.STACK6] ;
const getStack7CardIds  = (state) => state.board.holders.byId[constantsBoard.places.STACK7] ;
const getHome1CardIds   = (state) => state.board.holders.byId[constantsBoard.places.HOME1]  ;
const getHome2CardIds   = (state) => state.board.holders.byId[constantsBoard.places.HOME2]  ;
const getHome3CardIds   = (state) => state.board.holders.byId[constantsBoard.places.HOME3]  ;
const getHome4CardIds   = (state) => state.board.holders.byId[constantsBoard.places.HOME4]  ;
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

const resultFunc = (ids, cards) => ids.map((id) => cards[id]);

const resultFunc2 = (id) => id;

export default {
  getDeckCards    : createSelector([getDeckCardIds  , getCards ] , resultFunc),
  getOpenCards    : createSelector([getOpenCardIds  , getCards ] , resultFunc),
  getStack1Cards  : createSelector([getStack1CardIds, getCards ] , resultFunc), 
  getStack2Cards  : createSelector([getStack2CardIds, getCards ] , resultFunc),
  getStack3Cards  : createSelector([getStack3CardIds, getCards ] , resultFunc),
  getStack4Cards  : createSelector([getStack4CardIds, getCards ] , resultFunc), 
  getStack5Cards  : createSelector([getStack5CardIds, getCards ] , resultFunc),
  getStack6Cards  : createSelector([getStack6CardIds, getCards ] , resultFunc),
  getStack7Cards  : createSelector([getStack7CardIds, getCards ] , resultFunc), 
  getHome1Cards   : createSelector([getHome1CardIds , getCards ] , resultFunc), 
  getHome2Cards   : createSelector([getHome2CardIds , getCards ] , resultFunc),
  getHome3Cards   : createSelector([getHome3CardIds , getCards ] , resultFunc),
  getHome4Cards   : createSelector([getHome4CardIds , getCards ] , resultFunc),
  getNonDeckCards : createSelector([getNonDeckCards , getCards ] , resultFunc),
  getHolderId     : createSelector([getHolderId   ] , resultFunc2),
  getLastCards    : createSelector([getLastCards  ] , resultFunc2),
  getLastCard     : createSelector([getLastCard   ] , resultFunc2),
  getChildCards   : createSelector([getChildCards ] , resultFunc2)
};