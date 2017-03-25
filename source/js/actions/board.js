/**
 * Важный action creator.
 * Мост между пользовательскими действиями и движком.
 */
import actions from '../constants/actions';

export default {
  cardDrop: function(id, target_type, target_index) {
    console.log('card drop');
    return {
      card_id       : id,
      target_index  : target_index,
      target_type   : target_type,
      type          : actions.CARD_MOVE_BY_PLAYER
    };
  },
  deckClick: function() {
    console.log('single deck click');
    return {
      type: actions.CARD_BACK_BY_PLAYER
    };
  },
  cardClick: function() {
    console.log('single card click');
    return {
      type: actions.CARD_OPEN_BY_PLAYER
    };
  },
  cardDoubleClick: function(id) {
    console.log('double card click');
    return {
      source_id   : id,
      type        : actions.CARD_TRY_HOME_BY_PLAYER
    };
  }
}