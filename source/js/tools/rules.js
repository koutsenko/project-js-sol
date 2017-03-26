import { places } from '../constants/app';

const canAcceptDropToStack = function(source, target) {
  if (target === undefined) {
    return source.rank === 'K';
  } else {
    let ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '=', 'J', 'Q', 'K'];
    let suits = [undefined, 'H', 'S', 'D', 'C'];
    let rankRule = (ranks.indexOf(source.rank)+1) === (ranks.indexOf(target.rank));
    let suitRule = (suits.indexOf(source.suit) + suits.indexOf(target.suit)) % 2;
    return rankRule && suitRule;
  }
};

const canAcceptDropToHome = function(source, target) {
  if (target === undefined) {
    return source.rank === 'A';
  } else {
    let ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '=', 'J', 'Q', 'K'];
    let rankRule = ranks.indexOf(source.rank) === (ranks.indexOf(target.rank)+1);
    let suitRule = source.suit === target.suit;
    return rankRule && suitRule;
  }
};

const isGameEnd = function(cards) {
  return Object.keys(cards).every(function(id) {
    return cards[id].place.owner.type === places.HOME;
  });
};

export { canAcceptDropToHome, canAcceptDropToStack, isGameEnd };