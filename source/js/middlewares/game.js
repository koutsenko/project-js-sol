import   actions      from '../constants/actions';

import recordActions from '../actions/records';

import { isGameEnd } from '../tools/rules';

const canComplete = function(board) {
  // если есть закрытые карты в стеках, автосбор пока невозможен
  if (Object.keys(board.stacks).some(function(key) {
    return board.stacks[key].some(function(id) {
      return board.cards[id].flip === true;
    });
  })) {
    return false;
  }

  // если есть закрытые карты в open, автосбор пока невозможен
  if (board.open.some(function(id) {
    return board.cards[id].flip === true;
  })) {
    return false;
  }

  // если есть закрытые карты в deck, автосбор пока невозможен
  if (board.deck.some(function(id) {
    return board.cards[id].flip === true;
  })) {
    return false;
  }

  // ну или нам ничего не мешает...
  // TEST Предполагается что мы не попадем в ситуацию, когда этот метод вызван на уже законченной игре...
  return true;
}

export default function(store) {
  var getState = store.getState;

  return function(next) {
    return function(action) {
      let returnValue = next(action);
      switch (action.type) {
        case actions.LOAD_SCENARIO:
        // FIXME эта четверка действий может и не случиться, если хакнутый клиент пришлет невовремя или не с теми параметрами. И что? Походу просто лишняя нагрузка на сервер...
        case actions.CARD_BACK_BY_PLAYER:
        case actions.CARD_OPEN_BY_PLAYER:
        case actions.CARD_MOVE_BY_PLAYER:
        case actions.CARD_TRY_HOME_BY_PLAYER:
        case actions.REVERT:
          // TODO возможно это станет единым событием, накладывающим "маску запрета" на все контролы игры
          // TODO хотя щас я уже думаю что "масок запрета" должно быть две - на игровое поле и на меню
          // попапы в масках запрета не нуждаются
          let canCompleteValue = canComplete(getState().board);
          store.dispatch({
            value : canCompleteValue,
            type  : actions.MENU_BTN3_STATE
          });
          if (isGameEnd(getState().board.cards)) {
            store.dispatch({
              type  : actions.GAME_END
            });
          }
          break;
        case actions.GAME_END:
          store.dispatch({
            value : false,
            type  : actions.MENU_BTN3_STATE
          });
          break;
      }


      // отдельные обработки для меню, пока для кнопки Новая игра
      switch (action.type) {
        case actions.GAME_CREATED:
          store.dispatch({
            type  : actions.MENU_BTN1_STATE,
            value : false
          });
          break;

        // TODO имей в виду, что GAME_LOAD потребует еще и проверки MENU_BTN3_STATE
        case actions.GAME_START:
          store.dispatch({
            type  : actions.MENU_BTN1_STATE,
            value : true
          });
          break;
      }

      // отдельно обрабатываем конец игры, чтобы показать таблицу рекордов
      if (action.type === actions.GAME_END) {
        let state = getState();
        store.dispatch(recordActions.write({
          moves: state.board.index,
          nick: "тест",
          time: state.game.time
        }));
        store.dispatch({
          type: actions.SHOW_RECORDS
        });
      }

      return returnValue;
    };
  };
};
