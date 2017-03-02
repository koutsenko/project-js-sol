import actions from '../constants/actions';

export default function(store) {
  var getState = store.getState;
  var timers = [];

  return function(next) {
    return function(action) {
      let state = getState();
      if ((action.type === 'CLOSE_RECORDS') && (state.result !== undefined)) {
        console.log('Закрытие таблицы рекордов после окончания игры');
        let actions = [];
        for (var i = 0; i < 4; i++) {
          for (var j = state.gameCurrent.board.homes[i].length; j > 0; j--) {
            actions.push({
              id    : state.gameCurrent.board.homes[i][j-1],
              index : i,
              type  : 'HOME_TO_DECK'
            });
          }
        }
        
        actions.forEach(function(action, index) {
          let timer = setTimeout(function() {
            store.dispatch(action);

          }, index*100);
          timers.push(timer);
        });

      } else if (action.type === 'NEW_GAME') {
        // Очищаем анимации, игрок не захотел смотреть на анимацию сбора карт
        timers.forEach(function(timer) {
          clearTimeout(timer);
        });     
      }

      return next(action);
    };
  };
};
