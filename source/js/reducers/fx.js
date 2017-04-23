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
      card_highlights  : {},      // ассоциативный массив подсветок карт
      home_highlights  : {},      // ассоциативный массив подсветок домов
      stack_highlights : {},      // ассоциативный массив подсветок стопок
      mini             : false    // флаг работы на маленьком экране
    }
  }

  switch (action.type) {
    case actions.FX_MINI:
      var newState = JSON.parse(JSON.stringify(state));
      newState.mini = true;
      return newState;

    case actions.DRAG_ENTER_INTO_CARD:
      var newState = JSON.parse(JSON.stringify(state));
      if (action.target.place.owner.type === places.STACK) {
        newState.card_highlights[action.target.id] = canAcceptDropToStack(action.source, action.target) ? highlights.ACCEPT : highlights.DENY;
      } else if (action.target.place.owner.type === places.HOME) {
        newState.card_highlights[action.target.id] = canAcceptDropToHome(action.source, action.target) ? highlights.ACCEPT : highlights.DENY;
      }
      return newState;

    case actions.DRAG_ENTER_INTO_HOME:
      var newState = JSON.parse(JSON.stringify(state));
      newState.home_highlights[action.target_index] = canAcceptDropToHome(action.source) ? highlights.ACCEPT : highlights.DENY;
      return newState;

    case actions.DRAG_ENTER_INTO_STACK:
      var newState = JSON.parse(JSON.stringify(state));
      newState.stack_highlights[action.target_index] = canAcceptDropToStack(action.source) ? highlights.ACCEPT : highlights.DENY;
      return newState;

    case actions.DRAG_END_CARD:
    case actions.DRAG_LEAVE_FROM_CARD:
    case actions.DRAG_LEAVE_FROM_HOME:
    case actions.DRAG_LEAVE_FROM_STACK:
      var newState = JSON.parse(JSON.stringify(state));
      newState.card_highlights   = {};     // ассоциативный массив подсветок карт
      newState.home_highlights   = {};     // ассоциативный массив подсветок домов
      newState.stack_highlights  = {};     // ассоциативный массив подсветок стопок
      return newState;
  }

  return state;
};

const buildHighlights = function() {
  return {

  };
};
