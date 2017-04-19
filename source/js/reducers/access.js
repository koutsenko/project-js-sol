import actions from '../constants/actions';

export default function(state, action) {
  if (state === undefined) {
    state = {
      canComplete       : false,
      controlsEnabled   : false,
      gameCreateEnabled : true
    };
  }

  switch (action.type) {
    case actions.MENU_BTN1_STATE:
      var newState = JSON.parse(JSON.stringify(state));
      newState.gameCreateEnabled = action.value;
      return newState;

    case actions.MENU_BTN3_STATE:
      var newState = JSON.parse(JSON.stringify(state));
      newState.canComplete = action.value;
      return newState;

    case actions.GAME_START:    // сигнал об окончании раздачи и старте игры
    case actions.LOAD_SCENARIO: // сигнал о загрузке сохраненки
      var newState = JSON.parse(JSON.stringify(state));
      newState.controlsEnabled = true;
      return newState;

    case actions.GAME_CREATED:  // сигнал о раздаче карт, пока идет анимация - делать ничего нельзя
    case actions.GAME_END:      // конец игры, между играми делать ничего нельзя
      var newState = JSON.parse(JSON.stringify(state));
      newState.controlsEnabled = false;
      return newState;
  }

  return state;
};