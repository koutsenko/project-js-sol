import   actions  from '../constants/actions' ;

export default function(state, action) {
  if (state === undefined) {
    state = {
      aboutVisible    : false,
      recordsVisible  : false,
      rulesVisible    : false
    };
  }

  switch(action.type) {     
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
      newState.recordsVisible = true;
      return newState;

    case actions.CLOSE_RECORDS:
      var newState = JSON.parse(JSON.stringify(state));
      newState.recordsVisible = false;
      return newState;
  }

  return state;
};