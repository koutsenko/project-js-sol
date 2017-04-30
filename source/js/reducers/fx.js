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
      interact_holder     : {
        dYroll    : 0,                    // тeкущий индекс роллера
        startId   : undefined,            // id верхней открытой карты роллера
        id        : undefined,            // id карты которую в конечном итоге выбрали
        index     : undefined,            // индекс текущего холдера, откуда идет dnd         
        dragging  : false,                // факт движения (стек надо приподнять)
        rolling   : false,                // факт роллинга (стек надо приподнять и увеличить)
        type      : undefined             // тип холдера - дом/стек
      }
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

    case actions.DRAG_START_CARD:
      var newState = JSON.parse(JSON.stringify(state));
      newState.maskVisible      = false;
      newState.interact_holder  = {
        dYroll    : 0,
        startId   : undefined,
        id        : action.id,
        index     : action.hindex,
        dragging  : true,
        rolling   : false,
        type      : action.htype
      };
      return newState;

    case actions.ROLL_START:
      var newState = JSON.parse(JSON.stringify(state));
      newState.maskVisible      = true;
      newState.interact_holder  = {
        dYroll    : 0,
        startId   : action.id,
        id        : undefined,
        index     : action.hindex,
        dragging  : false,
        rolling   : true,
        type      : action.htype
      };
      return newState;

    case actions.ROLL_CHANGE:
      var newState = JSON.parse(JSON.stringify(state));
      newState.interact_holder.dYroll = action.delta;
      return newState;

    case actions.ROLL_CANCEL:
      var newState = JSON.parse(JSON.stringify(state));
      newState.maskVisible      = false;
      newState.interact_holder  = {
        dYroll    : 0,
        startId   : undefined,
        id        : undefined,
        index     : undefined,
        dragging  : false,
        rolling   : false,
        type      : undefined
      };
      return newState;

    case actions.ROLL_END:
      var newState = JSON.parse(JSON.stringify(state));
      newState.maskVisible = false;
      return newState;

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
      var newState = JSON.parse(JSON.stringify(state));
      newState.interact_holder = {
        dYroll    : 0,
        startId   : undefined,
        id        : undefined,
        index     : undefined,
        dragging  : false,
        rolling   : false,
        type      : undefined
      };
      newState.card_highlights   = {};     // ассоциативный массив подсветок карт
      newState.home_highlights   = {};     // ассоциативный массив подсветок домов
      newState.stack_highlights  = {};     // ассоциативный массив подсветок стопок
      return newState;
      
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
