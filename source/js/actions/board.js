import constantsActions from 'constants/actions' ;
import constantsBoard   from 'constants/board'   ;

/**
 * @param {*} source_card_id    - дроп source объекта , обычно это только карта!
 * @param {*} target_holder_id  - id холдера куда дроп. редьюсер разберется.
 */
function madeMove(source_card_id, target_holder_id) {
  return {
    card_id           : source_card_id,
    target_holder_id  : target_holder_id,
    type              : constantsActions.CARD_MOVE_BY_PLAYER
  };
}

let deckClick = function() {
  return {
    type: constantsActions.CARD_BACK_BY_PLAYER
  };
};

let deckCardClick = function() {
  return function(dispatch, getState) {
    let state = getState();
    let holder = state.turn.holders.byId[constantsBoard.places.DECK];
    let card_id = holder[holder.length - 1];
    dispatch({
      card_id           : card_id,
      target_holder_id  : constantsBoard.places.OPEN,
      type              : constantsActions.CARD_MOVE_BY_PLAYER
    });
  };
};

export default {
  madeMove            ,
  deckClick           ,
  deckCardClick
};
