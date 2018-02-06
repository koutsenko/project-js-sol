/**
 * Данная мидлвара впоследствии будет работать только на сервере.
 * Ее задача:
 * - взять экшен юзера (например перевернуть карты open в deck)
 * - сдиспатчить экшен ядра, насыщенный инфой, которую юзер не должен знать (например перевернуть AC, 5S, 5K из open в deck)
 *
 * //TODO 1 Впоследствие, надо:
 * - собственно, насытить серверные экшены данными (позаимствовать часть логики из текущих "неатомарных" редьюсеров)
 * - переключить редьюсер state.turn и сопутствующие, на обработку уже серверных экшенов.
 * - упростится код редьюсеров, и уже можно будет через combineReducers разделить state.turn на 4 атомарных редьюсера, использующих Object.assign
 *
 * //TODO 2 Подумать над названием мидлвары
 */

import constantsActions from 'constants/actions' ;
import constantsBoard   from 'constants/board'   ;
import selectorsTurn    from 'selectors/turn'    ;

export default (store) => (next) => (action) => {
  const getState = store.getState;
  const state = getState();
  if (action.type === constantsActions.CARD_BACK_BY_PLAYER) {
    store.dispatch({
      cards : state.turn.holders.byId[constantsBoard.places.OPEN].slice(),
      turn  : JSON.parse(JSON.stringify(state.turn)),
      type  : constantsActions.CORE_CARD_BACK_BY_PLAYER
    });
  } else if (action.type === constantsActions.CARD_MOVE_BY_ENGINE) {
    const source_holder_id  = selectorsTurn.getHolderId(state.turn, action.card_id);

    store.dispatch({
      source_holder_id  : source_holder_id,
      target_holder_id  : action.target_holder_id,
      cards             : [action.card_id],
      flipped           : action.flipped,
      type              : constantsActions.CORE_CARD_MOVE_BY_ENGINE
    });
  } else if (action.type === constantsActions.CARD_MOVE_BY_PLAYER) {
    const actions           = [];
    const source_holder_id  = selectorsTurn.getHolderId(state.turn, action.card_id);
    const source_holder     = state.turn.holders.byId[source_holder_id];
    let cards;

    const isOpenToDeck = (source_holder_id === constantsBoard.places.OPEN) && (action.target_holder_id === constantsBoard.places.DECK);
    if (isOpenToDeck) {
      // FIXME Это копипаста с кейса CARD_BACK_BY_PLAYER. Нужен рефакторинг.
      store.dispatch({
        cards : state.turn.holders.byId[constantsBoard.places.OPEN].slice(),
        turn  : JSON.parse(JSON.stringify(state.turn)),
        type  : constantsActions.CORE_CARD_BACK_BY_PLAYER
      });
      return;
    }

    if (constantsBoard.isStackPlace(source_holder_id)) {
      cards = source_holder.slice(source_holder.indexOf(action.card_id), source_holder.length)
    } else {
      cards = [action.card_id]
    }
    actions.push({
      source_holder_id  : source_holder_id,
      target_holder_id  : action.target_holder_id,
      cards             : cards,
      flipped           : action.target_holder_id === constantsBoard.places.OPEN || !!(state.turn.flipped.byId[source_holder_id].indexOf(action.card_id)+1),
      turn              : JSON.parse(JSON.stringify(state.turn)),
      type              : constantsActions.CORE_CARD_MOVE_BY_PLAYER
    });

    if (constantsBoard.isStackPlace(source_holder_id) && source_holder.length > cards.length) {
      const lastStackCardId = source_holder[source_holder.length-cards.length-1];
      if (!(state.turn.flipped.byId[source_holder_id].indexOf(lastStackCardId)+1)) {
        actions.push({
          cards   : [lastStackCardId],
          holders : [source_holder_id],
          type    : constantsActions.CORE_CARD_FLIP_BY_ENGINE
        })
      }
    }

    actions.forEach((action) => {
      store.dispatch(action);
    }, this);
  }

  return next(action);
};
