import constantsActions from 'constants/actions' ;
import constantsBoard   from 'constants/board'   ;
import selectorsGame    from 'selectors/game'    ;

const timers = [];

export default (store) => (next) => (action) => {
  const getState = store.getState;
  const state = getState();
  const game = selectorsGame.getCurrentGame(state.game);
  if ((action.type === constantsActions.CLOSE_RECORDS) && (game.result !== undefined)) {
    console.log('Закрытие таблицы рекордов после окончания игры');
    const batch = [];
    for (let i = 0; i < 4; i++) {
      const holder = state.turn.holders.byId['HOME' + (i+1)];
      for (let j = holder.length; j > 0; j--) {
        batch.push({
          card_id           : holder[j-1],
          flipped           : false,
          target_holder_id  : constantsBoard.places.DECK,
          type              : constantsActions.CARD_MOVE_BY_ENGINE
        });
      }
    }

    batch.forEach((action, index) => {
      const timer = setTimeout(() => {
        store.dispatch(action);

      }, index*100);
      timers.push(timer);
    });

  } else if (action.type === constantsActions.GAME_CREATED) {
    // Очищаем анимации, игрок не захотел смотреть на анимацию сбора карт
    timers.forEach((timer) => {
      clearTimeout(timer);
    });
  }

  return next(action);
};
