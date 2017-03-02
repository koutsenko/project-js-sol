import actions from '../constants/actions';

import recordActions from '../actions/records';

const canComplete = function(board) {
  // если есть закрытые карты в стеках, автосбор пока невозможен
  for (var i = 0; i < board.stacks.length; i++) {
    let cannotComplete = board.stacks[i].some(function(card) {
      return card.flip;
    });
    if (cannotComplete) {
      return false;
    }
  }

  // если в источниках остались карты, автосбор пока невозможен
  let alreadyComplete = true;
  for (var i = 0; i < board.stacks.length; i++) {
    if (board.stacks[i].length) {
      alreadyComplete = false;
    }
  }
  if (board.open.length) {
    alreadyComplete = false;
  }
  if (board.open.length) {
    alreadyComplete = false;
  }
  if (alreadyComplete) {
    return false;
  }

  // ну или нам ничего не мешает
  return true;
}

const canSwap = function(board) {
  return board.deck.length || board.open.length;
};

const gameEnd = function(board) {
  let gameIsEnded = true;
  for (var i = 0; i < 4; i++) {
    if (board.homes[i].length < 13) {
      gameIsEnded = false;
      break;
    }
  }
  return gameIsEnded;
}

export default function(store) {
  var getState = store.getState;

  return function(next) {
    return function(action) {
      let returnValue = next(action);
      switch (action.type) {
        case actions.LOAD_SCENARIO:
        case actions.GAME_START:
        case actions.STACK_TO_HOME:
        case actions.OPEN_TO_HOME:
        case actions.OPEN_CARD:
        case actions.REVERT:
          // TODO возможно это станет единым событием, накладывающим "маску запрета" на все контролы игры
          // TODO хотя щас я уже думаю что "масок запрета" должно быть две - на игровое поле и на меню
          // попапы в масках запрета не нуждаются
          store.dispatch({
            value : canComplete(getState().gameCurrent.board),
            type  : actions.CAN_COMPLETE
          });
          store.dispatch({
            value : canSwap(getState().gameCurrent.board),
            type  : actions.CAN_SWAP
          });
          if (gameEnd(getState().gameCurrent.board)) {
            store.dispatch({
              type  : actions.GAME_END
            });
          }
          break;
      }


      // отдельные обработки для меню, пока для кнопки Новая игра
      switch (action.type) {
        case actions.NEW_GAME:
          store.dispatch({
            type  : actions.CAN_NEW_GAME,
            value : false
          });
          break;

        case actions.GAME_START:
          store.dispatch({
            type  : actions.CAN_NEW_GAME,
            value : true
          });
          break;
      }

      // отдельно обрабатываем конец игры, чтобы показать таблицу рекордов
      if (action.type === actions.GAME_END) {
        let gameCurrent = getState().gameCurrent;
        store.dispatch(recordActions.write({
          moves: gameCurrent.moveIndex,
          nick: "тест",
          time: gameCurrent.elapsedTime
        }));
        store.dispatch({
          type: actions.SHOW_RECORDS
        });
      }

      return returnValue;
    };
  };
};
