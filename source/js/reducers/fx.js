import constantsActions from 'constants/actions' ;

export default function(state, action) {
  if (state === undefined) {
    state = {
      resizes             : 0,        // счетчик для форсированного ресайза
      maskVisible         : false,    // видимость маски вьюпорта
      mini                : false,    // признак работы на маленьком экране
      dndEnabled          : true      // включенность dnd
    }
  }

  switch (action.type) {
    case constantsActions.OPTIONS_TOGGLE_DND:
      var newState = JSON.parse(JSON.stringify(state));
      newState.dndEnabled = action.value;
      return newState;

    case constantsActions.SHOW_RECORDS:
    case constantsActions.SHOW_RULES:
    case constantsActions.SHOW_OPTIONS:
      var newState = JSON.parse(JSON.stringify(state));
      newState.maskVisible  = true;
      return newState;

    case constantsActions.CLOSE_RECORDS:
    case constantsActions.CLOSE_RULES:
    case constantsActions.CLOSE_OPTIONS:
      var newState = JSON.parse(JSON.stringify(state));
      newState.maskVisible  = false;
      return newState;

    case constantsActions.FX_RESIZE:
      var newState = JSON.parse(JSON.stringify(state));
      newState.mini = action.mini !== undefined ? action.mini : newState.mini;
      newState.resizes++;
      return newState;
  }

  return state;
};