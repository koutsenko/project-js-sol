/**
 * Важный action creator.
 * Мост между пользовательскими действиями и движком.
 */
import actions from '../constants/actions';
import { places } from '../constants/app';
import { canAcceptDropToStack, canAcceptDropToHome } from '../tools/rules';

export default {
  cardSelectCancel: function() {
    return function(dispatch, getState) {
      dispatch({
        type: actions.CARD_SELECT_CANCEL_BY_PLAYER
      });
    };
  },
  cardSelectOk: function(card) {
    return function(dispatch, getState) {
      dispatch({
        id: card.id,
        type: actions.CARD_SELECT_OK_BY_PLAYER
      });
    };
  },
  cardSelectFail: function(card) {
    return function(dispatch, getState) {
      dispatch({
        id: card.id,
        type: actions.CARD_SELECT_FAIL_BY_PLAYER
      });
    };
  },
  cardDrop: function(id, target_type, target_index) {
    return function(dispatch, getState) {
      // Дроп мог осуществлен на карту в деке или опен - фильтруем сразу
      if ((target_type === places.OPEN) || (target_type === places.DECK)) {
        return;
      }
      let state = getState();
      let target_holder = {
        [places.STACK]  : state.board.stacks[target_index],
        [places.HOME]   : state.board.homes[target_index]
      }[target_type];

      let source = state.board.cards[id];
      let target = target_holder.length ? state.board.cards[target_holder[target_holder.length - 1]] : undefined;

      if (((target_type === places.STACK) && canAcceptDropToStack(source, target)) || ((target_type === places.HOME) && canAcceptDropToHome(source, target))) {
        dispatch({
          card_id       : id,
          target_index  : target_index,
          target_type   : target_type,
          type          : actions.CARD_MOVE_BY_PLAYER
        });
      }
    };
  },
  deckClick: function() {
    return function(dispatch, getState) {
      dispatch({
        type: actions.CARD_BACK_BY_PLAYER
      });
    };
  },
  deckCardClick: function() {
    return function(dispatch, getState) {
      dispatch({
        type: actions.CARD_OPEN_BY_PLAYER
      });
    };
  },
  cardDoubleClick: function(id) {
    return function(dispatch, getState) {
      dispatch({
        source_id   : id,
        type        : actions.CARD_TRY_HOME_BY_PLAYER
      });
    };
  }
}