import   shuffle  from '../tools/fisherYates' ;
import { places } from '../constants/app'     ;
import   actions  from '../constants/actions' ;

import { canAcceptDropToHome }  from '../tools/rules'       ;
import { canAcceptDropToStack } from '../tools/rules'       ;

/**
 * Редьюсер, работающий с состоянием игры (игрового поля, она же доска) в данный ход.
 */
export default function(state, action) {
  if (state === undefined) {
    state = buildBoard();
  }

  switch(action.type) {
    case actions.REVERT:
      var newState = JSON.parse(JSON.stringify(state.previous));
      newState.index    = newState.index + 2;
      newState.previous = undefined;
      return newState;

    case actions.LOAD_SCENARIO:
      return loadBoard();

    case actions.GAME_CREATED:
      return buildBoard();

    case actions.CARD_BACK_BY_PLAYER:
      var newState = JSON.parse(JSON.stringify(state));
      var deck = newState.deck;
      var open = newState.open;
      open.forEach(function(id, i) {
        let card = newState.cards[id];
        card.flip = true;
        card.place = {
          index : i + deck.length,
          owner : {
            index : undefined,
            type  : places.DECK
          }
        };
        deck.unshift(id);
      }, this);
      newState.open = [];
      newState.previous = JSON.parse(JSON.stringify(state));
      newState.index++;
      return newState;

    case actions.CARD_MOVE_BY_ENGINE:
      var newState = JSON.parse(JSON.stringify(state));
      var map = {
        [places.DECK]   : 'deck'  ,
        [places.STACK]  : 'stacks',
        [places.HOME]   : 'homes' ,
        [places.OPEN]   : 'open'
      };

      var source_pointer = newState[map[action.source]];
      var target_pointer = newState[map[action.target]];
      var source = action.source_index !== undefined ? source_pointer[action.source_index] : source_pointer;
      var target = action.target_index !== undefined ? target_pointer[action.target_index] : target_pointer;

      var id = source.pop();
      newState.cards[id].place = {
        index : target.length,
        owner : {
          index : action.target_index,
          type  : action.target
        }
      }
      newState.cards[id].flip = action.flip || false;
      target.push(id);

      return newState;

    case actions.CARD_MOVE_BY_PLAYER:
      var newState = JSON.parse(JSON.stringify(state));
      var map = {
        [places.STACK]  : 'stacks',
        [places.HOME]   : 'homes' ,
        [places.OPEN]   : 'open'
      };
      var target        = newState[map[action.target_type]][action.target_index];
      var source_card   = newState.cards[action.card_id];
      var source_type   = source_card.place.owner.type;
      var source_index  = source_card.place.owner.index;
      var source        = (source_card.place.owner.index === undefined) ? newState[map[source_type]] : newState[map[source_type]][source_index];
      // определяем, сколько карт мы дропаем на самом деле
      var card_ids;
      if (source_type === places.STACK) {
        // источник - стек, надо взять все id стека, между текущим и последним
        card_ids = source.slice(source_card.place.index, source.length);
      } else {
        card_ids = [action.card_id];
      }

      // дроп нескольких карт разрешен только в стек!
      // FIXME а как мы вообще его допустили!? Должна была быть красная дропзона...
      if ((card_ids.length > 1) && (action.target_type !== places.STACK)) {
        return state;
      }

      card_ids.forEach(function(id) {
        var card = newState.cards[id];
        card.place = {
          index : target.length,
          owner : {
            type  : action.target_type,
            index : action.target_index
          }
        };
        source.splice(source.indexOf(id), 1);
        target.push(id);
      });

      if ((source_type === places.STACK) && source.length) {
        var last = newState.cards[source[source.length-1]]
        last.flip = false;
      }

      newState.previous = JSON.parse(JSON.stringify(state));
      newState.index++;
      return newState;

    case actions.CARD_OPEN_BY_PLAYER:
      var newState = JSON.parse(JSON.stringify(state));
      var deck = newState.deck;
      var open = newState.open;
      var id = deck.pop();
      var card = newState.cards[id];
      card.flip = false;
      card.place = {
        index : open.length,
        owner : {
          index : undefined,
          type  : places.OPEN
        }
      };
      open.push(id);
      newState.previous = JSON.parse(JSON.stringify(state));
      newState.index++;
      return newState;

    case actions.CARD_TRY_HOME_BY_PLAYER:
      var newState = JSON.parse(JSON.stringify(state));
      for (var i = 0; i < 4; i++) {
        var home              = newState.homes[i];
        var source_card       = newState.cards[action.source_id];
        var target_last_card  = home.length ? newState.cards[home[home.length-1]] : undefined;
        if (canAcceptDropToHome(source_card, target_last_card)) {
          var map = {
            [places.DECK]   : 'deck'  ,
            [places.STACK]  : 'stacks',
            [places.HOME]   : 'homes' ,
            [places.OPEN]   : 'open'
          };
          var source = (source_card.place.owner.index === undefined) ? newState[map[source_card.place.owner.type]] : newState[map[source_card.place.owner.type]][source_card.place.owner.index];
          source.pop();
          if (source.length) {
            newState.cards[source[source.length-1]].flip = false;
          }
          newState.homes[i].push(action.source_id);
          source_card.place = {
            index : newState.homes[i].length,
            owner : {
              index : i,
              type  : places.HOME
            }
          };

          newState.previous = JSON.parse(JSON.stringify(state));
          newState.index++;
          break;
        }
      }

      // TEST здесь я всегда возвращаю newState, даже если не найдется дом в который можно положить карту.
      // если после старта игры в тесте вызвать этот метод миллион раз, не потечет ли память?
      return newState;
  }

  return state;
};

const buildBoard = function() {
  let deck  = buildDeck();
  let cards = buildCards(deck);

  return {
    index     : 0,          // этот ход имеет определенный номер в игре.
    previous  : undefined,  // ссылка на копию самого себя (кроме previous - память ограничена 1-м ходом назад)
    cards     : cards,      // ассоциативный массив объектов карт
    deck      : deck,       // массив id карт, в данный момент находящихся в деке
    open      : [],         // массив id карт, в данный момент открытых рядом с декой
    homes     : {           // ассоциативный массив объектов домов с массивами id карт
      '0': [],
      '1': [],
      '2': [],
      '3': [],
    },
    stacks    : {           // ассоциативный массив объектов стопок с массивами id карт
      '0': [],
      '1': [],
      '2': [],
      '3': [],
      '4': [],
      '5': [],
      '6': []
    }
  };
}

const buildDeck = function() {
  let deck = [];
  let suits = ['H', 'D', 'C', 'S'];
  let ranks = ['A', 'K', 'Q', 'J', '=', '9', '8', '7', '6', '5', '4', '3', '2'];

  ranks.forEach(function(rank) {
    suits.forEach(function(suit) {
      deck.push(rank+suit);
    });
  });

  return shuffle(deck);
};

const buildCards = function(deck) {
  let cards = {};

  deck.forEach(function(id, index) {
    cards[id] = buildCard(id, true, places.DECK, undefined, index);
  });

  return cards;
};

const loadBoard = function() {
  let stacks = {
    '0': ['KS'],
    '1': [],
    '2': [],
    '3': [],
    '4': [],
    '5': [],
    '6': []
  };
  let homes = {
    '0': ['AH', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '=H', 'JH', 'QH', 'KH'],
    '1': ['AD', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '=D', 'JD', 'QD', 'KD'],
    '2': ['AC', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '=C', 'JC', 'QC', 'KC'],
    '3': ['AS', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '=S', 'JS', 'QS'      ]
  };

  let cards = {};
  Object.keys(stacks).forEach(function(key) {
    stacks[key].forEach(function(id, index) {
      cards[id] = buildCard(id, false, places.STACK, key, index);
    });
  });
  Object.keys(homes).forEach(function(key) {
    homes[key].forEach(function(id, index) {
      cards[id] = buildCard(id, false, places.HOME, key, index);
    });
  });

  return {
    index     : 230,
    previous  : undefined,
    cards     : cards,
    deck      : [],
    open      : [],
    homes     : homes,
    stacks    : stacks
  };
}

const buildCard = function(id, flipped, placeType, placeIndex, indexInPlace) {
  return {
    id    : id      ,
    rank  : id[0]   ,
    suit  : id[1]   ,
    flip  : flipped ,
    place : {
      index : indexInPlace,
      owner : {
        index : placeIndex,
        type  : placeType
      }
    }
  };
};