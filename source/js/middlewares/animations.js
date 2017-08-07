import constantsActions from '../constants/actions' ;
import constantsBoard   from '../constants/board'   ;
import selectorsGame    from '../selectors/game'    ;

export default function(store) {
  var getState = store.getState;
  var timers = [];

  return function(next) {
    return function(action) {
      let state = getState();
      let game = selectorsGame.getCurrentGame(state);
      if ((action.type === constantsActions.CLOSE_RECORDS) && (game.result !== undefined)) {
        console.log('Закрытие таблицы рекордов после окончания игры');
        let batch = [];
        for (var i = 0; i < 4; i++) {
          let holder = state.board.holders.byId['HOME' + (i+1)];
          for (var j = holder.length; j > 0; j--) {
            batch.push({
              card_id       : holder[j-1],
              flip          : true,
              target_type   : constantsBoard.places.DECK,
              type          : constantsActions.CARD_MOVE_BY_ENGINE
            });
          }
        }

        batch.forEach(function(action, index) {
          let timer = setTimeout(function() {
            store.dispatch(action);

          }, index*100);
          timers.push(timer);
        });        

      } else if (action.type === constantsActions.GAME_CREATED) {
        // Очищаем анимации, игрок не захотел смотреть на анимацию сбора карт
        timers.forEach(function(timer) {
          clearTimeout(timer);
        });
      }

      return next(action);
    };
  };
};
