import constantsBoard from 'constants/board';
import selectorsBoard from 'selectors/board';

const canComplete = function(state) {
  return !selectorsBoard.getNonDeckCards(state).some(function(card) { 
    return card.flip;
  });
};

const isAllowableCard = function(cardId, boardState) {
  let isFlipped   = !boardState.cards.byId[cardId].flip;
  let insideStack = constantsBoard.isStackPlace(selectorsBoard.getHolderId(cardId, boardState));
  let isLast      = !!(selectorsBoard.getLastCards(boardState).indexOf(cardId)+1);

  return (isFlipped && insideStack) || isLast;
};

/**
 * Доделать на предмет дропа в OPEN и в DECK
 */
const canAcceptDrop = function(source_card_id, source_holder_id, target_card_id, target_holder_id) {
  let result = false;

  let sourceRank = source_card_id[0];
  
  let isEmptyHolder = !target_card_id;

  if (target_holder_id === source_holder_id) {
    return false;
  } else if (target_holder_id === constantsBoard.places.DECK) {
    // сперва обработаем редкий кейс дропа на ПУСТОЙ DECK (по идее target_card_id === undefined....)
    result = ((source_holder_id === constantsBoard.places.OPEN) && !target_card_id);
  } else if (target_holder_id === constantsBoard.places.OPEN) {
    // потом  обработаем редкий кейс дропа на OPEN
    result = (source_holder_id === constantsBoard.places.DECK);
  } else if (source_holder_id === constantsBoard.places.DECK){
    // потом редкий кейс если мы из DECK потащили куда-то еще..
    // если переместить кейс в другое место, все сломается.
    // TODO вероятно надо матрицу совместимости source/target-холдеров сделать.
    // и применять непосредственно перед применением игровых правил. 
    result = false;
  } else {
    // а потом кейсы с STACK/HOME, для случаев пустых и непустых холдера цели
    if (isEmptyHolder) {
      if (constantsBoard.isStackPlace(target_holder_id)) {
        result = (sourceRank === 'K');
      } else if (constantsBoard.isHomePlace(target_holder_id)) {
        result = (sourceRank === 'A');
      }
    } else {
      let sourceSuit = source_card_id[1];
      let targetRank = target_card_id[0];
      let targetSuit = target_card_id[1];
      let ranks = constantsBoard.ranksL2H;
      let suits = ['H', 'S', 'D', 'C'];

      if (constantsBoard.isStackPlace(target_holder_id)) {
        let rankRule = (ranks.indexOf(sourceRank)+1) === (ranks.indexOf(targetRank));
        let suitRule = (suits.indexOf(sourceSuit) + suits.indexOf(targetSuit)) % 2;
        result = rankRule && suitRule;      
      } else if (constantsBoard.isHomePlace(target_holder_id)) {
        let rankRule = ranks.indexOf(sourceRank) === (ranks.indexOf(targetRank)+1);
        let suitRule = sourceSuit === targetSuit;
        result = rankRule && suitRule;
      }
    }
  }

  return result;
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
const getHomeMap = function(boardState) {
  let ranks = constantsBoard.ranks.slice().reverse();
  let freeSuits = constantsBoard.suits.slice();
  let map = {};
  constantsBoard.getHomePlaces().forEach(function(place, index) {
    let home = boardState.holders.byId[place];
    if (home[0] !== undefined) {
      freeSuits.splice(freeSuits.indexOf(home[0][1]), 1);
    }
  });
  constantsBoard.getHomePlaces().forEach(function(place, index) {
    let home = boardState.holders.byId[place];
    // если этот дом еще не заполнен
    if (home.length !== 13) {
      let last = home[home.length-1];
      if (last === undefined) {
        map[index] = 'A'+freeSuits[0];
        freeSuits.splice(0, 1);
      } else {
        map[index] = (ranks[ranks.indexOf(last[0])+1] || ranks[0])+last[1];
      }
    }
  });
  return map;
};

export default { 
  canAcceptDrop     ,
  canComplete       , 
  isAllowableCard   ,
  getHomeMap        ,
  isGameEnd
};