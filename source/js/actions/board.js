/**
 * Важный action creator.
 * Мост между пользовательскими действиями и движком.
 */
import actions from '../constants/actions';
import { places } from '../constants/app';
import { canAcceptDropToStack, canAcceptDropToHome } from '../tools/rules';

export default {
  cardDrop: function(id, target_type, target_index) {
    // console.log('card drop');
    return function(dispatch, getState) {

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
    // console.log('single deck click');
    return function(dispatch, getState) {
      dispatch({
        type: actions.CARD_BACK_BY_PLAYER
      });
    };
  },
  cardClick: function() {
    // console.log('single card click');
    return function(dispatch, getState) {
      dispatch({
        type: actions.CARD_OPEN_BY_PLAYER
      });
    };
  },
  cardDoubleClick: function(id) {
    // console.log('double card click');
    return function(dispatch, getState) {
      dispatch({
        source_id   : id,
        type        : actions.CARD_TRY_HOME_BY_PLAYER
      });
    };
  }
}