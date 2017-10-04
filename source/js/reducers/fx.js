import constantsActions from 'constants/actions' ;

export default function(state, action) {
  if (state === undefined) {
    state = {
      maskVisible         : false,    // видимость маски вьюпорта
      dndEnabled          : true,     // включенность dnd
      layout              : {
        mini: false,                  // признак работы на маленьком экране
        size: {                       // размер корневого контейнера
          w: 0,
          h: 0
        }
      }
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
      newState.layout = action.layout;
      return newState;
  }

  return state;
};