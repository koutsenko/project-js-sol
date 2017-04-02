import consts from '../constants/actions';
import cPlaces from '../constants/places';

const buildCard = function(rank, suit, type, itemIndex, placeIndex, flip) {
  return {
    id    : rank + suit,
    rank  : rank,
    suit  : suit,
    flip  : flip || false,
    place : {
      index : itemIndex,      // индекс карты в колонке
      owner : {
        index : placeIndex,   // индекс самой колонки среды подобных, если их много, иначе undefined
        type  : type
      }
    }
  };
};

const buildNonShuffledDeck = function() {
  var deck = [];
  var suits = ['H', 'D', 'C', 'S'];
  var ranks = ['A', 'K', 'Q', 'J', '=', '9', '8', '7', '6', '5', '4', '3', '2'];
  ranks.forEach(function(rank) {
    suits.forEach(function(suit) {
      deck.push(rank+suit);
    });
  })

  return deck;
}

const buildEmptyGame = function(deck) {
  let cards = {};
  var deck = deck || [buildNonShuffledDeck()];
  deck.forEach(function(id, index) {
    cards[id] = buildCard(id[0], id[1], cPlaces.DECK, index, undefined, true);
  });

  return {
    completed: false,
    canSwap: false,
    /**
     * TODO Перенести отсюда - они относятся к меню.
     */
    canNewGame: true,
    canComplete: false,
    cards: cards,
    board: {
      deck: deck,
      open: [],
      homes: [
        [],
        [],
        [],
        []
      ],
      stacks: [
        [],
        [],
        [],
        [],
        [],
        [],
        []
      ]
    },
    prevBoard: undefined,
    moveIndex: 0,
    elapsedTime: 0
  }
};

export default function(state, action) {
  console.log('reducer called, action', action.type);
  if (state === undefined) {
    let records     = JSON.parse(localStorage.getItem('m2w-sol-records'));
    let gamesCount  = localStorage.getItem('m2w-sol-games-count');
    let winsCount   = localStorage.getItem('m2w-sol-wins-count');
    state = {
      /**
       * TODO перенести в отдельное св-во объекта карта, когда заработает реестр карт
       */
      accepts         : {
        home: [ null, null, null, null ],
        stack: [ null, null, null, null, null, null, null ],
        card: {}
      },
      maskVisible     : false,
      showRecords     : false,
      showRules       : false,
      gameCurrent     : buildEmptyGame(),
      gamesCount      : gamesCount  || 0,   /** Общее кол-во сыгранных игр          */
      prevBoard       : undefined,
      records         : records     || [],  /** Рекорды                             */
      result          : undefined,          /** Выигранная сейчас игра              */
      resultIndex     : undefined,          /** Позиция в таблице 0-4 или 5         */
      winsCount       : winsCount   || 0    /** Общее кол-во выигранных игр         */
    };
  }

  switch(action.type) {
    case consts.DRAG_END_CARD:
      var newState = JSON.parse(JSON.stringify(state));
      newState.accepts = {
        home: [ null, null, null, null ],
        stack: [ null, null, null, null, null, null, null ],
        card: {}
      };
      return newState;

    case consts.DRAG_ENTER_HOME:
      var newState = JSON.parse(JSON.stringify(state));
      newState.accepts.home[action.index] = action.value;
      return newState;

    case consts.DRAG_LEAVE_HOME:
      var newState = JSON.parse(JSON.stringify(state));
      newState.accepts.home[action.index] = null;
      return newState;

    case consts.DRAG_ENTER_CARD:
      var newState = JSON.parse(JSON.stringify(state));
      newState.accepts.card[action.id] = action.value;
      return newState;

    case consts.DRAG_ENTER_STACK:
      var newState = JSON.parse(JSON.stringify(state));
      newState.accepts.stack[action.index] = action.value;
      return newState;

    case consts.DRAG_LEAVE_STACK:
      var newState = JSON.parse(JSON.stringify(state));
      newState.accepts.stack[action.index] = null;
      return newState;

    case consts.DRAG_LEAVE_CARD:
      var newState = JSON.parse(JSON.stringify(state));
      newState.accepts.card[action.id] = null;
      return newState;

    case consts.SHOW_ABOUT:
      var newState = JSON.parse(JSON.stringify(state));
      newState.showAbout = true;
      newState.maskVisible = true;
      return newState;

    case consts.CLOSE_ABOUT:
      var newState = JSON.parse(JSON.stringify(state));
      newState.showAbout = false;
      newState.maskVisible = false;
      return newState;

    case consts.SHOW_RULES:
      var newState = JSON.parse(JSON.stringify(state));
      newState.showRules = true;
      newState.maskVisible = true;
      return newState;

    case consts.CLOSE_RULES:
      var newState = JSON.parse(JSON.stringify(state));
      newState.showRules = false;
      newState.maskVisible = false;
      return newState;

    case consts.SHOW_RECORDS:
      var newState = JSON.parse(JSON.stringify(state));
      newState.showRecords = true;
      newState.maskVisible = true;
      return newState;

    case consts.CLOSE_RECORDS:
      var newState = JSON.parse(JSON.stringify(state));
      newState.showRecords = false;
      newState.maskVisible = false;
      newState.result = undefined;
      newState.resultIndex = undefined;
      return newState;

    case consts.GAME_END:
      var newState = JSON.parse(JSON.stringify(state));
      newState.gameCurrent.completed = true;
      newState.winsCount++;
      return newState;

    case consts.NEW_GAME:
      var newState = JSON.parse(JSON.stringify(state));
      newState.gameCurrent = buildEmptyGame(action.deck);
      return newState;

    case consts.DECK_TO_STACK:
      var newState = JSON.parse(JSON.stringify(state));
      var stack = newState.gameCurrent.board.stacks[action.index];
      var deck = newState.gameCurrent.board.deck;
      var id = newState.gameCurrent.board.deck.pop();
      var card = newState.gameCurrent.cards[id];
      card.flip = action.index !== stack.length;
      card.place = {
        index : stack.length,
        owner : {
          index : action.index,
          type  : cPlaces.STACK
        }
      };
      stack.push(card.id);
      return newState;

    case consts.CAN_SWAP:
      var newState = JSON.parse(JSON.stringify(state));
      newState.gameCurrent.canSwap = action.value;
      return newState;

    case consts.CAN_NEW_GAME:
      var newState = JSON.parse(JSON.stringify(state));
      newState.gameCurrent.canNewGame = action.value;
      return newState;

    case consts.CAN_COMPLETE:
      var newState = JSON.parse(JSON.stringify(state));
      newState.gameCurrent.canComplete = action.value;
      return newState;

    case consts.TICK:
      var newState = JSON.parse(JSON.stringify(state));
      newState.gameCurrent.elapsedTime++;
      return newState;

    case consts.HOME_TO_DECK:
      var newState = JSON.parse(JSON.stringify(state));
      newState.gameCurrent.cards[action.id].flip = true;
      newState.gameCurrent.cards[action.id].place = {
        index : newState.gameCurrent.board.deck.length,
        owner : {
          type  : cPlaces.DECK,
          index : undefined
        }
      };
      newState.gameCurrent.board.deck.push(newState.gameCurrent.board.homes[action.index].pop());
      return newState;


    case consts.LOAD_SCENARIO:
      var newState = JSON.parse(JSON.stringify(state));
      newState.gamesCount++;

      newState.gameCurrent.board = {
        deck: [],
        open: [],
        homes: [
          ['AH', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '=H', 'JH', 'QH', 'KH'],
          ['AD', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '=D', 'JD', 'QD', 'KD'],
          ['AC', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '=C', 'JC', 'QC', 'KC'],
          ['AS', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '=S', 'JS', 'QS'      ]
        ],
        stacks: [
          ['KS'],
          [],
          [],
          [],
          [],
          [],
          []
        ]
      };
      // TODO автоматизировать
      newState.gameCurrent.cards = {};
      newState.gameCurrent.board.deck.forEach(function(id, index) {
        newState.gameCurrent.cards[id] = buildCard(id[0], id[1], cPlaces.DECK, index, undefined);
      });
      newState.gameCurrent.board.open.forEach(function(id, index) {
        newState.gameCurrent.cards[id] = buildCard(id[0], id[1], cPlaces.OPEN, index, undefined);
      });
      newState.gameCurrent.board.homes.forEach(function(home, home_index) {
        home.forEach(function(id, index) {
          newState.gameCurrent.cards[id] = buildCard(id[0], id[1], cPlaces.HOME, index, home_index);
        });
      });
      newState.gameCurrent.board.stacks.forEach(function(stack, stack_index) {
        stack.forEach(function(id, index) {
          newState.gameCurrent.cards[id] = buildCard(id[0], id[1], cPlaces.STACK, index, stack_index);
        });
      });


      newState.gameCurrent.moveIndex = 230;
      newState.gameCurrent.elapsedTime = 23*60;
      return newState;

    case consts.NEW_RECORD:
      var newState = JSON.parse(JSON.stringify(state));
      newState.records.splice(action.index, 0, action.record);
      if (newState.records.length === 6) {
        newState.records.pop();
      }
      newState.resultIndex = action.index;
      newState.result = action.record;
      return newState;

    case consts.WEAK_RECORD:
      var newState = JSON.parse(JSON.stringify(state));
      newState.result = action.record;
      newState.resultIndex = 5;
      return newState;

    case consts.STACK_TO_HOME:
      var newState = JSON.parse(JSON.stringify(state));
      var card = newState.gameCurrent.cards[action.id];
      var old_index = card.place.owner.index;

      card.place = {
        index : newState.gameCurrent.board.homes[action.index].length,
        owner : {
          index : action.index,
          type  : cPlaces.HOME
        }
      };

      newState.gameCurrent.board.stacks[old_index].pop();
      newState.gameCurrent.board.homes[action.index].push(action.id);

      newState.gameCurrent.prevBoard = JSON.parse(JSON.stringify(state.gameCurrent.board));
      newState.gameCurrent.moveIndex++;
      return newState;

    case consts.OPEN_TO_HOME:
      var newState = JSON.parse(JSON.stringify(state));
      let id = newState.gameCurrent.board.open.pop();
      let card = newState.gameCurrent.cards[id];
      card.place = {
        index : newState.gameCurrent.board.open.length,
        owner : {
          index : action.index,
          type  : cPlaces.HOME
        }
      };
      newState.gameCurrent.board.homes[action.index].push(id);

      newState.gameCurrent.prevBoard = JSON.parse(JSON.stringify(state.gameCurrent.board));
      newState.gameCurrent.moveIndex++;
      return newState;

    case consts.OPEN_CARD:
      var newState = JSON.parse(JSON.stringify(state));
      let deck = newState.gameCurrent.board.deck;
      let open = newState.gameCurrent.board.open;
      if (deck.length) {
        let id = deck.pop();
        let card = newState.gameCurrent.cards[id];
        card.flip = false;
        card.place = {
          index : open.length,
          owner : {
            index : undefined,
            type  : cPlaces.OPEN
          }
        };
        open.push(id);
      } else if (open.length) {
        open.forEach(function(id, i) {
          let card = newState.gameCurrent.cards[id];
          card.flip = true;
          card.place = {
            index : i + deck.length,
            owner : {
              index : undefined,
              type  : cPlaces.DECK
            }
          };
          deck.unshift(id);
        }, this);
        newState.gameCurrent.board.open = [];
      }

      newState.gameCurrent.prevBoard = JSON.parse(JSON.stringify(state.gameCurrent.board));
      newState.gameCurrent.moveIndex++;
      return newState;

    case consts.REVERT:
      var newState = JSON.parse(JSON.stringify(state));
      newState.gameCurrent.board = JSON.parse(JSON.stringify(newState.gameCurrent.prevBoard));
      newState.gameCurrent.moveIndex++;
      newState.gameCurrent.prevBoard = undefined;
      return newState;

    default:
      if (!(action.type.indexOf('@@redux')+1)) {
        console.log('unhandled action: ', action.type);
      }
      return state;
  }
};
