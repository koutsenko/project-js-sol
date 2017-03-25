/**
 * Редьюсер, обрабатывает характеристики текущей игры.
 */
import actions from '../constants/actions';

export default function(state, action) {
  if (state === undefined) {
    state = {
      completed : false,      // FIXME Что это??? Флаг законченности игры?
      index     : undefined,  // Выигранная сейчас игра - место в таблице рекордов, 0-4 для рекорда, 5 для нерекорда
      result    : undefined,  // Выигранная сейчас игра - результат
      time      : 0,          // Длительность игры
    };
  }

  switch (action.type) {
    case actions.WEAK_RECORD:
      var newState = JSON.parse(JSON.stringify(state));
      newState.result = action.record;
      newState.index = 5;
      return newState;

    case actions.NEW_RECORD:
      var newState = JSON.parse(JSON.stringify(state));
      newState.index = action.index;
      newState.result = action.record;
      return newState;

    case actions.LOAD_SCENARIO:
      var newState = JSON.parse(JSON.stringify(state));
      newState.time = 23*60;
      return newState;

    case actions.TICK:
      var newState = JSON.parse(JSON.stringify(state));
      newState.time++;
      return newState;

    case actions.GAME_END:
      var newState = JSON.parse(JSON.stringify(state));
      newState.completed = true;
      return newState;

    case actions.CLOSE_RECORDS:
      var newState = JSON.parse(JSON.stringify(state));
      newState.result = undefined;
      newState.index  = undefined;
      return newState;
  }

  return state;
};