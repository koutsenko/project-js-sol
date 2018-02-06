/* eslint-disable no-var */
import   actions  from 'constants/actions' ;

export default function(state, action) {
  if (state === undefined) {
    state = {
      recordsVisible  : false,
      recordsCongrats : false,
      rulesVisible    : false,
      optionsVisible  : false
    };
  }

  var newState;

  switch(action.type) {
    case actions.SHOW_OPTIONS:
      newState = JSON.parse(JSON.stringify(state));
      newState.optionsVisible = true;
      return newState;

    case actions.CLOSE_OPTIONS:
      newState = JSON.parse(JSON.stringify(state));
      newState.optionsVisible = false;
      return newState;

    case actions.SHOW_RULES:
      newState = JSON.parse(JSON.stringify(state));
      newState.rulesVisible = true;
      return newState;

    case actions.CLOSE_RULES:
      newState = JSON.parse(JSON.stringify(state));
      newState.rulesVisible = false;
      return newState;

    case actions.SHOW_RECORDS:
      newState = JSON.parse(JSON.stringify(state));
      newState.recordsCongrats = !!action.congrats;
      newState.recordsVisible = true;
      return newState;

    case actions.CLOSE_RECORDS:
      newState = JSON.parse(JSON.stringify(state));
      newState.recordsCongrats = false;
      newState.recordsVisible = false;
      return newState;
  }

  return state;
}
