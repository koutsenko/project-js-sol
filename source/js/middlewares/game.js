import constantsActions from 'constants/actions' ;
import actionsRecords   from 'actions/records'   ;
import toolsRules       from 'tools/rules'       ;

export default function(store) {
  var getState = store.getState;

  return function(next) {
    return function(action) {
      let returnValue = next(action);
      switch (action.type) {
        case constantsActions.CARD_BACK_BY_PLAYER:
        case constantsActions.CARD_MOVE_BY_PLAYER:
          if (toolsRules.isGameEnd(getState())) {
            let state = getState();
            let gameId = state.game.allIds[state.game.allIds.length-1];
            let game = state.game.byId[gameId];
            store.dispatch({
              result  : {
                moves: state.board.index,
                nick: "тест",
                time: game.time
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
  };
};
