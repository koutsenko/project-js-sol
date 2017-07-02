/**
 * Редьюсер спецэффектов.
 * Пока что отвечает за подсветку дропзон.
 */
import   actions                from '../constants/actions' ;
import { places }               from '../constants/app'     ;
import { highlights }           from '../constants/app'     ;
import { canAcceptDropToHome }  from '../tools/rules'       ;
import { canAcceptDropToStack } from '../tools/rules'       ;

export default function(state, action) {
  if (state === undefined) {
    state = {
      card_highlights     : {},       // ассоциативный массив подсветок карт
      home_highlights     : {},       // ассоциативный массив подсветок домов
      stack_highlights    : {},       // ассоциативный массив подсветок стопок
      maskVisible         : false,    // видимость маски вьюпорта для роллинга и для попапов
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

    case actions.CARD_MOVE_BY_PLAYER:
    case actions.CARD_TRY_HOME_BY_PLAYER:
    case actions.CARD_SELECT_CANCEL_BY_PLAYER:
      var newState = JSON.parse(JSON.stringify(state));
      newState.card_highlights = {};
      return newState;

    case actions.CARD_SELECT_OK_BY_PLAYER:
      var newState = JSON.parse(JSON.stringify(state));
      newState.card_highlights = {
        [action.id]: highlights.ACCEPT
      };
      return newState;

    case actions.CARD_SELECT_FAIL_BY_PLAYER:
      var newState = JSON.parse(JSON.stringify(state));
      newState.card_highlights = {
        [action.id]: highlights.DENY
      }
      return newState;

    case actions.DRAG_END_CARD:
      var newState = JSON.parse(JSON.stringify(state));
      newState.card_highlights   = {};     // ассоциативный массив подсветок карт
      newState.home_highlights   = {};     // ассоциативный массив подсветок домов
      newState.stack_highlights  = {};     // ассоциативный массив подсветок стопок
      return newState;
  }

  return state;
};
