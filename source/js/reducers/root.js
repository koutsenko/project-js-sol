import consts from '../constants/actions';

const parse = function(texts) {
  return texts.map(function(item) {
    return {
      rank: item[1],
      suit: item[0],
      flip: false
    };
  })
};

const buildEmptyGame = function() {
  return {
    completed: false,
    canSwap: false,
    /**
     * TODO Перенести отсюда - они относятся к меню.
     */
    canNewGame: true,
    canComplete: false,
    board: {
      deck: [],
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
      maskVisible : false,
      showRecords : false,
      showRules   : false,
      gameCurrent : buildEmptyGame(),
      gamesCount  : gamesCount  || 0,   /** Общее кол-во сыгранных игр          */
      prevBoard   : undefined,
      records     : records     || [],  /** Рекорды                             */
      result      : undefined,          /** Выигранная сейчас игра              */
      resultIndex : undefined,          /** Позиция в таблице 0-4 или 5         */
      winsCount   : winsCount   || 0    /** Общее кол-во выигранных игр         */
    };
  }

  switch(action.type) {
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
      newState.gameCurrent = buildEmptyGame();
      return newState;

    case consts.LAY_TO_STACK:
      var newState = JSON.parse(JSON.stringify(state));
      newState.gameCurrent.board.stacks[action.index].push(action.card);
      return newState;

    case consts.LAY_TO_OPEN:
      var newState = JSON.parse(JSON.stringify(state));
      newState.gameCurrent.board.open.push(action.card);
      return newState;

    case consts.LAY_TO_DECK:
      var newState = JSON.parse(JSON.stringify(state));
      newState.gameCurrent.board.deck = newState.gameCurrent.board.deck.concat((action.cards));
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

    case consts.LOAD_SCENARIO:     
      var newState = JSON.parse(JSON.stringify(state));
      newState.gamesCount++;
      newState.gameCurrent.board = {
        deck: [],
        open: [],
        homes: [
          parse(['HA', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H=', 'HJ', 'HQ', 'HK']),
          parse(['DA', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D=', 'DJ', 'DQ', 'DK']),
          parse(['CA', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C=', 'CJ', 'CQ', 'CK']),
          parse(['SA', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S=', 'SJ', 'SQ'])
        ],
        stacks: [
          parse(['SK']),
          [],
          [],
          [],
          [],
          [],
          []
        ]
      };
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
      var card;

      card = newState.gameCurrent.board.stacks[action.srcIndex].pop();
      newState.gameCurrent.board.homes[action.dstIndex].push(card);

      newState.gameCurrent.prevBoard = JSON.parse(JSON.stringify(state.gameCurrent.board));
      newState.gameCurrent.moveIndex++;
      return newState;

    case consts.DECK_TO_HOME:
      var newState = JSON.parse(JSON.stringify(state));
      var card;

      card = newState.gameCurrent.board.deck.pop();
      newState.gameCurrent.board.homes[action.dstIndex].push(card);
      // Перевернуть следующую карту в деке
      if (newState.gameCurrent.board.deck.length) {
        newState.gameCurrent.board.deck[newState.gameCurrent.board.deck.length-1].flip = false;
      }

      newState.gameCurrent.prevBoard = JSON.parse(JSON.stringify(state.gameCurrent.board));
      newState.gameCurrent.moveIndex++;
      return newState;

    case consts.OPEN_TO_HOME:
      var newState = JSON.parse(JSON.stringify(state));
      var card;

      card = newState.gameCurrent.board.open.pop();
      newState.gameCurrent.board.homes[action.dstIndex].push(card);

      newState.gameCurrent.prevBoard = JSON.parse(JSON.stringify(state.gameCurrent.board));
      newState.gameCurrent.moveIndex++;
      return newState;

    case consts.OPEN_CARD:
      var newState = JSON.parse(JSON.stringify(state));
      // если в деке что-то есть - переносим как есть в опен
      if (newState.gameCurrent.board.deck.length) {
        let card = newState.gameCurrent.board.deck.pop();
        card.flip = false;
        newState.gameCurrent.board.open.push(card);
      } else if (newState.gameCurrent.board.open.length) {
        newState.gameCurrent.board.open.forEach(function(card) {
          card.flip = true;
          newState.gameCurrent.board.deck.unshift(card);
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
