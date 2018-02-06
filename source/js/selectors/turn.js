import { createSelector }     from 'reselect'         ;
import   createCachedSelector from 're-reselect'      ;

import   constantsBoard       from 'constants/board'  ;

const getParentFlips    = createCachedSelector(
  (cardId)                  => cardId ,
  (cardId, holder)          => holder ,
  (cardId, holder, flipped) => flipped,
  (cardId, holder, flipped) => {
    return holder.slice(0, holder.indexOf(cardId)+1).filter((id) => {
      return !!(flipped.indexOf(id) + 1);
    });
  }
)(
  (cardId) => cardId
);

const getChildCards     = createSelector(
  (boardState)          => boardState ,
  (boardState, cardId)  => cardId     ,
  (boardState, cardId) => {
    let result;
    const holderId = getHolderId(boardState, cardId);

    if (constantsBoard.isStackPlace(holderId)) {
      const holder      = boardState.holders.byId[holderId];
      const startIndex  = holder.indexOf(cardId);
      const endIndex    = holder[holder.length];
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
  (boardState, cardId) => {
    const holderIds = boardState.holders.allIds;
    let holderId;

    for (let i = 0; i < holderIds.length; i++) {
      if (boardState.holders.byId[holderIds[i]].indexOf(cardId)+1) {
        holderId = holderIds[i];
        break;
      }
    }

    return holderId;
  }
);

const getLastCard       = createSelector(
  (boardState)          => boardState ,
  (boardState, holderId)=> holderId   ,
  (boardState, holderId) => {
    const holder = boardState.holders.byId[holderId];

    return (holder && holder.length) ? holder[holder.length - 1] : undefined;
  }
);

const getLastCards      = createSelector(
  (boardState)          => boardState ,
  (boardState) => {
    return boardState.holders.allIds.map((holderId) => {
      return boardState.holders.byId[holderId][boardState.holders.byId[holderId].length - 1];
    });
  }
);

const getNonDeckCards   = createSelector(
  (boardState)          => boardState ,
  (boardState) => {
    const holderIds   = boardState.holders.allIds.slice();
    let cards       = [];

    holderIds.splice(holderIds.indexOf(constantsBoard.places.DECK), 1);
    holderIds.forEach((holderId) => {
      cards = cards.concat(boardState.holders.byId[holderId]);
    });

    return cards;
  }
);

export default {
  getParentFlips  ,
  getChildCards   ,
  getHolderId     ,
  getLastCard     ,
  getLastCards    ,
  getNonDeckCards
};
