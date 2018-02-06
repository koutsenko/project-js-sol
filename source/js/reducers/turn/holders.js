/* eslint-disable no-var */
import shuffleSeed      from 'knuth-shuffle-seeded' ;

import constantsActions from 'constants/actions'    ;
import constantsBoard   from 'constants/board'      ;

/**
 * Редьюсер, работающий с состоянием игры (игрового поля, она же доска) в данный ход.
 */
export default function(state, action) {
  if (state === undefined) {
    state = buildHolders();
  }

  var newState;

  switch(action.type) {
    case constantsActions.REVERT:
      return action.turn.holders;

    case constantsActions.LOAD_SCENARIO:
      var save = JSON.parse(decodeURI(action.data));
      return save.board.holders;

    case constantsActions.GAME_CREATED:
      return buildHolders(action.seed);

    case constantsActions.CORE_CARD_BACK_BY_PLAYER:
      newState = Object.assign({}, state);
      var deck = newState.byId[constantsBoard.places.DECK];
      var open = newState.byId[constantsBoard.places.OPEN];
      action.cards.forEach((id) => {
        deck.unshift(id);
        open.splice(open.indexOf(id), 1);
      }, this);
      return newState;

    case constantsActions.CORE_CARD_MOVE_BY_PLAYER:
    case constantsActions.CORE_CARD_MOVE_BY_ENGINE:
      newState = Object.assign({}, state);
      var source_holder   = newState.byId[action.source_holder_id];
      var target_holder   = newState.byId[action.target_holder_id];
      action.cards.forEach((id) => {
        source_holder.splice(source_holder.indexOf(id), 1);
        target_holder.push(id);
      });
      return newState;
  }

  return state;
}

const buildHolders = (seed) => {
  const holders = {
    byId    : {},
    allIds  : Object.keys(constantsBoard.places)
  };

  holders.allIds.forEach((holder) => {
    holders.byId[holder] = [];
  });
  holders.byId = Object.assign(holders.byId, {
    [constantsBoard.places.DECK]: shuffleSeed(constantsBoard.cards.slice(), seed || 'test')
  });

  return holders;
};
