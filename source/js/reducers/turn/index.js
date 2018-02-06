/* eslint-disable no-var */
import constantsActions from 'constants/actions';

/**
 * Редьюсер счетчика ходов.
 */
export default function(state, action) {
  if (state === undefined) {
    state = 0;
  }

  switch(action.type) {
    case constantsActions.REVERT:
    case constantsActions.CORE_CARD_BACK_BY_PLAYER:
    case constantsActions.CORE_CARD_MOVE_BY_PLAYER:
      return state+1;

    case constantsActions.LOAD_SCENARIO:
      var save = JSON.parse(decodeURI(action.data));
      return save.board.index;

    case constantsActions.GAME_CREATED:
      return 0;
  }

  return state;
}
