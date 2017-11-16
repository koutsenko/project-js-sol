import constantsActions from 'constants/actions'  ;
import constantsBoard   from 'constants/board'    ;
import selectorsTurn    from 'selectors/turn'     ;
import selectorsGame    from 'selectors/game'     ;
import toolsRules       from 'tools/rules'        ;
import toolsTime        from 'tools/time'         ;

export default {
  load: function(data) {
    return {
      currentTime : Date.now(),
      data        : data,
      type        : constantsActions.LOAD_SCENARIO
    };
  },
  deal: function(seed) {
    return function(dispatch, getState) {
      // Даем сигнал о старте раздачи карт - это подготовит колоду
      dispatch({
        seed  : seed,
        type  : constantsActions.GAME_CREATED
      });

      let state   = getState();
      let batch   = [];
      let source  = state.turn.holders.byId[constantsBoard.places.DECK].slice();

      // Раскладываем карты по стекам
      for (var i = 0; i < 7; i++) {
        for (var j = 0; j <= i; j++) {
          batch.push({
            card_id           : source.pop(),
            flipped           : i === j,
            target_holder_id  : constantsBoard.places['STACK' + (i+1)],
            type              : constantsActions.CARD_MOVE_BY_ENGINE
          });
        }
      }

      // Кладем одну в open
      batch.push({
        card_id           : source.pop(),
        flipped           : true,
        target_holder_id  : constantsBoard.places.OPEN,
        type              : constantsActions.CARD_MOVE_BY_ENGINE
      });

      // Даем сигнал о старте игры
      batch.push({
        time  : Date.now(),
        type  : constantsActions.GAME_START
      });

      batch.forEach(function(action, index) {
        setTimeout(function() {
          dispatch(action);
        }, 100*(index+1));
      });
    };
  },
  dump: function() {
    return function(dispatch, getState) {
      let state = getState();
      let game = selectorsGame.getCurrentGame(state.game);
      let data = {
        board: {
          flipped : state.turn.flipped,
          holders : state.turn.holders,
          index   : state.turn.index
        },
        seed    : game.seed,
        time    : toolsTime.calculateElapsedSeconds(game.time, Date.now()),
      };
      setTimeout(function() {
        let save = encodeURI(JSON.stringify(data));
        console.log('Dumping game save, length = ' + save.length);
        console.log(save);
      }.bind(this), 0);
    };
  },
  completeGame: function() {
    return function(dispatch, getState) {
      let cycleCount = 0;

      do {
        cycleCount++;
        if (cycleCount === 255) {
          console.log('Какая-то ошибка');
          return;
        }

        // ищем карты, подходящие для перемещения в дома
        let map = toolsRules.getHomeMap(getState().turn);

        // смотрим последние карты стеков и open
        let lastCards = constantsBoard.getStackPlaces().map(function(place) {
          let holder = getState().turn.holders.byId[place];
          return holder.length ? holder[holder.length-1] : undefined;
        }).filter(function(card_id){
          return card_id !== undefined;
        });
        let openHolder = getState().turn.holders.byId[constantsBoard.places.OPEN];
        let lastOpenCard = openHolder.length ? openHolder[openHolder.length - 1] : undefined;
        if (lastOpenCard !== undefined) {
          lastCards.push(lastOpenCard);
        }

        // ищем есть ли на концах стеков или в open нужные карты
        let canMove = false;
        Object.keys(map).forEach(function(index) {
          if (lastCards.indexOf(map[index])+1) {
            canMove = true;
          }
        });

        // если нет, открываем карту и повторяем цикл
        if (!canMove) {
          let deckHolder = getState().turn.holders.byId[constantsBoard.places.DECK];
          let openHolder = getState().turn.holders.byId[constantsBoard.places.OPEN];
          if (deckHolder.length) {
            dispatch({
              card_id           : deckHolder[deckHolder.length - 1],
              target_holder_id  : constantsBoard.places.OPEN,
              type              : constantsActions.CARD_MOVE_BY_PLAYER
            });
          } else if (openHolder.length) {
            dispatch({
              type: constantsActions.CARD_BACK_BY_PLAYER
            });
          }
          continue;
        }

        // иначе перемещаем найденные
        Object.keys(map).forEach(function(home_index) {
          let wantedCard  = map[home_index];

          // смотрим верхние карты
          lastCards.forEach(function(id) {
            if (id === wantedCard) {
              dispatch({
                card_id           : id,
                target_holder_id  : constantsBoard.places['HOME'+(parseInt(home_index)+1)],
                type              : constantsActions.CARD_MOVE_BY_PLAYER
              });
            }
          });
        });
      } while(!toolsRules.isGameEnd(getState()));
    }.bind(this);
  },
  revertTurn: function() {
    return function(dispatch, getState) {
      dispatch({
        turn : getState().turn.previous,
        type : constantsActions.REVERT
      });
    };
  }
};
