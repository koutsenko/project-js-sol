/**
 * Редьюсер доп. GUI-опций.
 */
import   actions                from '../constants/actions' ;
import { places }               from '../constants/app'     ;

export default function(state, action) {
  if (state === undefined) {
    state = {
      maskVisible         : false,    // видимость маски вьюпорта
      mini                : false,    // признак работы на маленьком экране
    }
  }

  switch (action.type) {
    case actions.SHOW_ABOUT:
    case actions.SHOW_RECORDS:
    case actions.SHOW_RULES:
      var newState = JSON.parse(JSON.stringify(state));
      newState.maskVisible  = true;
      return newState;

    case actions.CLOSE_ABOUT:
    case actions.CLOSE_RECORDS:
    case actions.CLOSE_RULES:
      var newState = JSON.parse(JSON.stringify(state));
      newState.maskVisible  = false;
      return newState;

    case actions.FX_MINI:
      var newState = JSON.parse(JSON.stringify(state));
      newState.mini = true;
      return newState;

    case actions.FX_NOT_MINI:
      var newState = JSON.parse(JSON.stringify(state));
      newState.mini = false;
      return newState;
  }

  return state;
};
