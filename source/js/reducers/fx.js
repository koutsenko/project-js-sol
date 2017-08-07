import constantsActions from '../constants/actions' ;

export default function(state, action) {
  if (state === undefined) {
    state = {
      maskVisible         : false,    // видимость маски вьюпорта
      mini                : false,    // признак работы на маленьком экране
    }
  }

  switch (action.type) {
    case constantsActions.SHOW_ABOUT:
    case constantsActions.SHOW_RECORDS:
    case constantsActions.SHOW_RULES:
      var newState = JSON.parse(JSON.stringify(state));
      newState.maskVisible  = true;
      return newState;

    case constantsActions.CLOSE_ABOUT:
    case constantsActions.CLOSE_RECORDS:
    case constantsActions.CLOSE_RULES:
      var newState = JSON.parse(JSON.stringify(state));
      newState.maskVisible  = false;
      return newState;

    case constantsActions.FX_MINI:
      var newState = JSON.parse(JSON.stringify(state));
      newState.mini = true;
      return newState;

    case constantsActions.FX_NOT_MINI:
      var newState = JSON.parse(JSON.stringify(state));
      newState.mini = false;
      return newState;
  }

  return state;
};