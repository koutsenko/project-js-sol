import constantsActions from 'constants/actions'    ;

/**
 * Редьюсер, работающий с предыдущим состоянием родительского объекта turn.
 */
export default function(state, action) {
  if (state === undefined) {
    state = null;
  }

  switch(action.type) {
    case constantsActions.REVERT:
    case constantsActions.LOAD_SCENARIO:
    case constantsActions.GAME_CREATED:
      return null;

    case constantsActions.CORE_CARD_BACK_BY_PLAYER:
    case constantsActions.CORE_CARD_MOVE_BY_PLAYER:
      return action.turn;
  }

  return state;
}
