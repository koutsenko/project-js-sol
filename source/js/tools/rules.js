import constantsBoard from 'constants/board';
import selectorsBoard from 'selectors/board';

const canComplete = function(state) {
  return !selectorsBoard.getNonDeckCards(state).some(function(card) { 
    return card.flip;
  });
};

const canStartDrag = function(cardId, boardState) {
  let isVisible   = !boardState.cards.byId[cardId].flip;
  let insideStack = constantsBoard.isStackPlace(selectorsBoard.getHolderId(cardId, boardState));
  let isLast      = !!(selectorsBoard.getLastCards(boardState).indexOf(cardId)+1);

  return isVisible && (insideStack || isLast);
};

const canAcceptDropToStack = function(source, target) {
  if (target === undefined) {
    return source.rank === 'K';
  } else {
    let ranks = constantsBoard.ranksL2H;
    let suits = ['H', 'S', 'D', 'C'];
    let rankRule = (ranks.indexOf(source.rank)+1) === (ranks.indexOf(target.rank));
    let suitRule = (suits.indexOf(source.suit) + suits.indexOf(target.suit)) % 2;
    return rankRule && suitRule;
  }
};

const canAcceptDropToHome = function(source, target) {
  if (target === undefined) {
    return source.rank === 'A';
  } else {
    let ranks = constantsBoard.ranksL2H;
    let rankRule = ranks.indexOf(source.rank) === (ranks.indexOf(target.rank)+1);
    let suitRule = source.suit === target.suit;
    return rankRule && suitRule;
  }
};

const isGameEnd = function(state) {
  return Object.keys(state.board.cards.byId).every(function(id) {
    let holderId = selectorsBoard.getHolderId(id, state.board);
    return constantsBoard.isHomePlace(holderId);
  });
};

/**
 * Метод вычисляющий в какой хоум какую карту можно вкинуть.
 */
const getHomeMap = function(state) {
  let ranks = constantsBoard.ranks.slice().reverse();
  let freeSuits = constantsBoard.suits.slice();
  let map = {};
  constantsBoard.getHomePlaces().forEach(function(place, index) {
    let home = state.board.holders.byId[place];
    if (home[0] !== undefined) {
      freeSuits.splice(freeSuits.indexOf(home[0][1]), 1);
    }
  });
  constantsBoard.getHomePlaces().forEach(function(place, index) {
    let home = state.board.holders.byId[place];
    // если этот дом еще не заполнен
    if (home.length !== 13) {
      let last = home[home.length-1];
      if (last === undefined) {
        map[index] = 'A'+freeSuits[0];
        freeSuits.splice(0, 1);
      } else {
        map[index] = ranks[ranks.indexOf(last[0])+1]+last[1];
      }
    }
  });
  return map;
};

export default { 
  canAcceptDropToHome   ,
  canAcceptDropToStack  ,
  canComplete           , 
  canStartDrag          ,
  getHomeMap            ,
  isGameEnd
};