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
            store.dispatch({
              type  : constantsActions.GAME_COMPLETE
            });
          }
          break;
      }

      // отдельно обрабатываем конец игры, чтобы показать таблицу рекордов
      if (action.type === constantsActions.GAME_COMPLETE) {
        let state = getState();
        store.dispatch(actionsRecords.write({
          moves: state.board.index,
          nick: "тест",
          time: state.game.time
        }));
        store.dispatch({
          congrats: true,
          type: constantsActions.SHOW_RECORDS
        });
      }

      return returnValue;
    };
  };
};
