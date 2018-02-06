/* eslint-disable no-var */
import constantsActions from 'constants/actions'    ;
import constantsBoard   from 'constants/board'      ;

/**
 * Редьюсер, работающий с массивом state.turn.flipped.
 * Данный массив содержит открытые в данный момент карты.
 */
export default function(state, action) {
  if (state === undefined) {
    state = buildFlipped();
  }

  var newState;

  switch(action.type) {
    case constantsActions.REVERT:
      return action.turn.flipped;

    case constantsActions.LOAD_SCENARIO:
      var save = JSON.parse(decodeURI(action.data));
      return save.board.flipped;

    case constantsActions.GAME_CREATED:
      return buildFlipped();

    case constantsActions.CORE_CARD_BACK_BY_PLAYER:
      newState = Object.assign({}, state);
      newState.byId[constantsBoard.places.DECK] = [];
      newState.byId[constantsBoard.places.OPEN] = [];
      return newState;

    case constantsActions.CORE_CARD_MOVE_BY_PLAYER:
    case constantsActions.CORE_CARD_MOVE_BY_ENGINE:
      // TODO здесь я впервые задумался о том, что в других играх может понадобиться закрыть карту при перемещении.
      // TODO следует написать тесты и проверить работу экшенов с такими условиями.
      newState = Object.assign({}, state);
      var sourceFlips = newState.byId[action.source_holder_id];
      var targetFlips = newState.byId[action.target_holder_id];
      var sourceIndex, targetIndex;
      action.cards.forEach((cardId) => {
        sourceIndex = sourceFlips.indexOf(cardId);
        targetIndex = targetFlips.indexOf(cardId);
        //  вытаскиваем из sourceFlips в любом случае (при наличии)
        if (sourceIndex !== -1) {
          sourceFlips.splice(sourceIndex, 1);
        }
        // добавляем/убираем в targetFlips (по необходимости)
        if (action.flipped && targetIndex === -1) {
          targetFlips.push(cardId);
        } else if (!action.flipped && targetIndex !== -1) {
          targetFlips.splice(targetIndex, 1);
        }
      });
      return newState;

    case constantsActions.CORE_CARD_FLIP_BY_ENGINE:
      // TODO сейчас этот экшен только открывает карту. Не умеет закрывать.
      newState = Object.assign({}, state);
      action.cards.forEach((cardId, index) => {
        var holderId = action.holders[index];
        if (newState.byId[holderId].indexOf(cardId) === -1) {
          newState.byId[holderId] = [...newState.byId[holderId], cardId];
        }
      });
      return newState;

  }

  return state;
}

const buildFlipped = () => {
  const flipped = {
    byId    : {},
    allIds  : Object.keys(constantsBoard.places)
  };

  flipped.allIds.forEach((holder) => {
    flipped.byId[holder] = [];
  });

  return flipped;
}
