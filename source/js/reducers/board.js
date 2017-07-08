import   actions                from '../constants/actions' ;
import { canAcceptDropToHome }  from '../tools/rules'       ;
import { canAcceptDropToStack } from '../tools/rules'       ;
import { places }               from '../constants/app'     ;
import   shuffleSeed            from 'knuth-shuffle-seeded' ;

function getHolder(state, place_type, place_index) {
  let map = {
    [places.DECK]   : 'deck',
    [places.STACK]  : 'stacks',
    [places.HOME]   : 'homes' ,
    [places.OPEN]   : 'open'
  };
  let pointer = state[map[place_type]];

  return (place_index !== undefined) ? pointer[place_index] : pointer; 
}

function cardMove(action, newState, raw) {
  var source_card     = newState.cards[action.card_id];
  var source_type     = source_card.place.owner.type;
  var source_index    = source_card.place.owner.index;
  var source_holder   = getHolder(newState, source_type, source_index);

  var target_type     = action.target_type;
  var target_index    = action.target_index;
  var target_holder   = getHolder(newState, target_type, target_index);
  
  var card_ids = (source_type === places.STACK) ? source_holder.slice(source_card.place.index, source_holder.length) : [action.card_id];
  card_ids.forEach(function(id) {
    var card = newState.cards[id];
    card.touched = !raw ? true : card.touched;
    card.place = {
      index : target_holder.length,
      owner : {
        type  : target_type,
        index : target_index
      }
    };
    card.flip = raw ? action.flip : ((target_type === places.OPEN) ? false : card.flip);
    source_holder.splice(source_holder.indexOf(id), 1);
    target_holder.push(id);
  });

  if (!raw && (source_type === places.STACK) && source_holder.length) {
    newState.cards[source_holder[source_holder.length-1]].flip = false;
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
    case actions.CARD_SELECT_CANCEL_BY_PLAYER:
      var newState = JSON.parse(JSON.stringify(state));
      newState.selected = undefined;
      return newState;

    case actions.CARD_SELECT_OK_BY_PLAYER:
      var newState = JSON.parse(JSON.stringify(state));
      newState.selected = action.id;
      return newState;

    case actions.CARD_SELECT_FAIL_BY_PLAYER:
      var newState = JSON.parse(JSON.stringify(state));
      newState.selected = undefined;
      return newState;

    case actions.REVERT:
      var newState = JSON.parse(JSON.stringify(state.previous));
      newState.index    = newState.index + 2;
      newState.previous = undefined;
      return newState;

    case actions.LOAD_SCENARIO:
      return loadBoard(action.data);

    case actions.GAME_CREATED:
      return buildBoard(action.seed);

    case actions.CARD_BACK_BY_PLAYER:
      var newState = JSON.parse(JSON.stringify(state));
      var deck = newState.deck;
      var open = newState.open;
      var length = newState.open.length;
      open.forEach(function(id, i) {
        let card = newState.cards[id];
        card.flip = true;
        card.touched = true;
        card.place = {
          index : length - i - 1,
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
      return cardMove(action, newState, true);

    case actions.CARD_MOVE_BY_PLAYER:
      var newState = JSON.parse(JSON.stringify(state));
      newState.previous = JSON.parse(JSON.stringify(state));
      newState.selected = undefined;
      newState.index++;
      return cardMove(action, newState);
  }

  return state;
};

const buildBoard = function(seed) {
  let deck  = buildDeck(seed || 'test');
  let cards = buildCards(deck);

  return {
    selected  : undefined,  // выбранная в данный момент карта
    index     : 0,          // этот ход имеет определенный номер в игре.
    previous  : undefined,  // ссылка на копию самого себя (кроме previous - память ограничена 1-м ходом назад)
    cards     : cards,      // ассоциативный массив объектов карт
    deck      : deck,       // массив id карт, в данный момент находящихся в деке
    open      : [],         // массив id карт, в данный момент открытых рядом с декой
    homes     : [           // двухмерный массив объектов домов с массивами id карт
      [],
      [],
      [],
      [],
    ],
    stacks    : [           // двухмерный массив объектов стопок с массивами id карт
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  };
}

const buildDeck = function(seed) {
  let deck = [];
  let suits = ['H', 'D', 'C', 'S'];
  let ranks = ['A', 'K', 'Q', 'J', '=', '9', '8', '7', '6', '5', '4', '3', '2'];

  ranks.forEach(function(rank) {
    suits.forEach(function(suit) {
      deck.push(rank+suit);
    });
  });

  return shuffleSeed(deck, seed);
};

const buildCards = function(deck) {
  let cards = {};

  deck.forEach(function(id, index) {
    cards[id] = buildCard(id, true, places.DECK, undefined, index);
  });

  return cards;
};

const loadBoard = function(data) {
  // Обрати внимание, что при загрузке расклада параметры touched будут везде false. Я пока не понял как правильнее.
  let save = JSON.parse(decodeURI(data));
  let board = save.board;
  let opened = save.opened;  // ids открытых карт стеков
  let stacks = board.stacks;
  let homes = board.homes;
  let deck = board.deck;
  let open = board.open;
  let index = board.index;

  // let stacks = [
  //   ['KS'],
  //   [],
  //   [],
  //   [],
  //   [],
  //   [],
  //   []
  // ];
  // let homes = [
  //   ['AH', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '=H', 'JH', 'QH', 'KH'],
  //   ['AD', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '=D', 'JD', 'QD', 'KD'],
  //   ['AC', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '=C', 'JC', 'QC', 'KC'],
  //   ['AS', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '=S', 'JS', 'QS'      ]
  // ];

  let cards = {};
  stacks.forEach(function(stack, place_index) {
    stack.forEach(function(id, index) {
      let flip = opened.indexOf(id) < 0;
      cards[id] = buildCard(id, flip, places.STACK, place_index, index);
    });
  });
  homes.forEach(function(home, place_index) {
    home.forEach(function(id, index) {
      let flip = opened.indexOf(id) < 0;
      cards[id] = buildCard(id, flip, places.HOME, place_index, index);
    });
  });
  deck.forEach(function(id, index, all) {
    let flip = opened.indexOf(id) < 0;
    cards[id] = buildCard(id, flip, places.DECK, undefined, index);
  });
  open.forEach(function(id, index, all) {
    let flip = opened.indexOf(id) < 0;
    cards[id] = buildCard(id, flip, places.OPEN, undefined, index);
  });

  return {
    index     : index,
    previous  : undefined,
    cards     : cards,
    deck      : deck,
    open      : open,
    homes     : homes,
    stacks    : stacks
  };
}

const buildCard = function(id, flipped, placeType, placeIndex, indexInPlace) {
  return {
    id      : id      ,
    rank    : id[0]   ,
    suit    : id[1]   ,
    flip    : flipped ,
    touched : false   ,
    place   : {
      index : indexInPlace,
      owner : {
        index : placeIndex,
        type  : placeType
      }
    }
  };
};

// FIXME - генерация случайной колоды это должна быть часть некоего модуля tools/cards.
export { buildDeck, loadBoard };