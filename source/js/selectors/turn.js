import { createSelector }     from 'reselect'         ;

import   constantsBoard       from 'constants/board'  ;

const getCardIndex      = createSelector(
  (boardState)          => boardState ,
  (boardState, cardId)  => cardId     ,
  function(boardState, cardId) {
    let holderId = getHolderId(boardState, cardId);
    let holder = boardState.holders.byId[holderId];

    return holder.indexOf(cardId);
  }
);

const getChildCards     = createSelector(
  (boardState)          => boardState ,
  (boardState, cardId)  => cardId     ,
  function(boardState, cardId) {
    let result;
    let holderId = getHolderId(boardState, cardId);

    if (constantsBoard.isStackPlace(holderId)) {
      let holder      = boardState.holders.byId[holderId];
      let startIndex  = holder.indexOf(cardId);
      let endIndex    = holder[holder.length];
      result = holder.slice(startIndex, endIndex);
    } else {
      result = [cardId];
    }

    return result;
  }
);

const getHolderId       = createSelector(
  (boardState)          => boardState ,
  (boardState, cardId)  => cardId     ,
  function(boardState, cardId) {
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
);

const getHolderFlips      = createSelector(
  (boardState)          => boardState ,
  (boardState, cardId)  => cardId     ,
  function(boardState, cardId) {
    let holder  = boardState.holders.byId[getHolderId(boardState, cardId)];
    let flipped = boardState.flipped;

    return holder.filter(function(id) {
      return !!(flipped.indexOf(id)+1);
    });
  }
);

const getLastCard       = createSelector(
  (boardState)          => boardState ,
  (boardState, holderId)=> holderId   ,
  function(boardState, holderId) {
    let holder = boardState.holders.byId[holderId];

    return (holder && holder.length) ? holder[holder.length - 1] : undefined;
  }
);

const getLastCards      = createSelector(
  (boardState)          => boardState ,
  function(boardState) {
    return boardState.holders.allIds.map(function(holderId) {
      return boardState.holders.byId[holderId][boardState.holders.byId[holderId].length - 1];
    });
  }
);

const getNeighbours     = createSelector(
  (boardState)          => boardState ,
  (boardState, cardId)  => cardId     ,
  function(boardState, cardId) {
    return boardState.holders.byId[getHolderId(boardState, cardId)];
  }
);

const getNonDeckCards   = createSelector(
  (boardState)          => boardState ,
  function(boardState) {
    let holderIds   = boardState.holders.allIds.slice();
    let cards       = [];

    holderIds.splice(holderIds.indexOf(constantsBoard.places.DECK), 1);
    holderIds.forEach(function(holderId) {
      cards = cards.concat(boardState.holders.byId[holderId]);
    });

    return cards;
  }
);

export default {
  getCardIndex    ,
  getChildCards   ,
  getHolderId     ,
  getHolderFlips  ,
  getLastCard     ,
  getLastCards    ,
  getNeighbours   ,
  getNonDeckCards
};
