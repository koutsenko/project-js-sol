import constantsActions from 'constants/actions'    ;
import constantsBoard   from 'constants/board'      ;

/**
 * Редьюсер, работающий с массивом state.turn.flipped.
 * Данный массив содержит открытые в данный момент карты.
 */
export default function(state, action) {
  if (state === undefined) {
    state = [];
  }

  switch(action.type) {
    case constantsActions.REVERT:
      return action.turn.flipped;

    case constantsActions.LOAD_SCENARIO:
      let save = JSON.parse(decodeURI(action.data));
      return save.board.flipped;

    case constantsActions.GAME_CREATED:
      return [];

    case constantsActions.CORE_CARD_BACK_BY_PLAYER:
      // FIXME spread operator!
      var result = state.slice();
      action.cards.forEach(function(id) {
        if (result.indexOf(id)+1) {
          result.splice(result.indexOf(id), 1);
        }
      }, this);
      return result;

    case constantsActions.CORE_CARD_MOVE_BY_PLAYER:
    case constantsActions.CORE_CARD_MOVE_BY_ENGINE:
      var result = state.slice();
      action.cards.forEach(function(id) {
        if (action.flipped) {
          if (!(result.indexOf(id)+1)) {
            result.push(id);
          }
        } else {
          if (!!(result.indexOf(id)+1)) {
            result.splice(result.indexOf(id), 1);
          }
        }
      });
      return result;

    case constantsActions.CORE_CARD_FLIP_BY_ENGINE:
      var result = state.slice();
      action.cards.forEach(function(id) {
        if (!(result.indexOf(id)+1)) {
          result.push(id);
        }
      });
      return result;

  }

  return state;
};
