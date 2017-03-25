import actions from '../constants/actions';
import { places } from '../constants/app';

export default function(store) {
  var getState = store.getState;
  var timers = [];

  return function(next) {
    return function(action) {
      let state = getState();
      if ((action.type === actions.CLOSE_RECORDS) && (state.game.result !== undefined)) {
        console.log('Закрытие таблицы рекордов после окончания игры');
        let batch = [];
        for (var i = 0; i < 4; i++) {
          for (var j = state.board.homes[i].length; j > 0; j--) {
            batch.push({
              flip          : true,
              source        : places.HOME,
              source_index  : i,
              target        : places.DECK,
              target_index  : undefined,
              type          : actions.CARD_MOVE_BY_ENGINE
            });
          }
        }

        batch.forEach(function(action, index) {
          let timer = setTimeout(function() {
            store.dispatch(action);

          }, index*100);
          timers.push(timer);
        });

      } else if (action.type === actions.GAME_CREATED) {
        // Очищаем анимации, игрок не захотел смотреть на анимацию сбора карт
        timers.forEach(function(timer) {
          clearTimeout(timer);
        });
      }

      return next(action);
    };
  };
};
