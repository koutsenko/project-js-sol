import   actions  from 'constants/actions' ;

export default function(state, action) {
  if (state === undefined) {
    state = {
      aboutVisible    : false,
      recordsVisible  : false,
      recordsCongrats : false,
      rulesVisible    : false,
      optionsVisible  : false
    };
  }

  switch(action.type) {     
    case actions.SHOW_OPTIONS:
      var newState = JSON.parse(JSON.stringify(state));
      newState.optionsVisible = true;
      return newState;

    case actions.CLOSE_OPTIONS:
      var newState = JSON.parse(JSON.stringify(state));
      newState.optionsVisible = false;
      return newState;

    case actions.SHOW_ABOUT:
      var newState = JSON.parse(JSON.stringify(state));
      newState.aboutVisible = true;
      return newState;

    case actions.CLOSE_ABOUT:
      var newState = JSON.parse(JSON.stringify(state));
      newState.aboutVisible = false;
      return newState;

    case actions.SHOW_RULES:
      var newState = JSON.parse(JSON.stringify(state));
      newState.rulesVisible = true;
      return newState;

    case actions.CLOSE_RULES:
      var newState = JSON.parse(JSON.stringify(state));
      newState.rulesVisible = false;
      return newState;

    case actions.SHOW_RECORDS:
      var newState = JSON.parse(JSON.stringify(state));
      newState.recordsCongrats = !!action.congrats;
      newState.recordsVisible = true;
      return newState;

    case actions.CLOSE_RECORDS:
      var newState = JSON.parse(JSON.stringify(state));
      newState.recordsCongrats = false;
      newState.recordsVisible = false;
      return newState;
  }

  return state;
};