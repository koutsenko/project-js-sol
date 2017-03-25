import actions from '../constants/actions';

export default function(state, action) {
  if (state === undefined) {
    state = {
      gameCreateEnabled : true,
      canComplete       : false
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
  }

  return state;
};