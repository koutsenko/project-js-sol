import constantsActions from 'constants/actions' ;
import actionsRecords   from 'actions/records'   ;
import toolsRules       from 'tools/rules'       ;
import toolsTime        from 'tools/time'        ;

export default (store) => (next) => (action) => {
  const getState = store.getState;
  const returnValue = next(action);
  switch (action.type) {
    case constantsActions.CARD_BACK_BY_PLAYER:
    case constantsActions.CARD_MOVE_BY_PLAYER:
      if (toolsRules.isGameEnd(getState())) {
        const state = getState();
        const gameId = state.game.allIds[state.game.allIds.length-1];
        const game = state.game.byId[gameId];
        store.dispatch({
          result  : {
            moves: state.turn.index,
            nick: "тест",
            time: toolsTime.calculateElapsedTime(game.time, Date.now())
          },
          type    : constantsActions.GAME_COMPLETE
        });
      }
      break;
  }

  // отдельно обрабатываем конец игры, чтобы показать таблицу рекордов
  if (action.type === constantsActions.GAME_COMPLETE) {
    store.dispatch(actionsRecords.write(action.result));
    store.dispatch({
      congrats: true,
      type: constantsActions.SHOW_RECORDS
    });
  }

  return returnValue;
};
