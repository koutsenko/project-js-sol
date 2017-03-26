import   actions      from '../constants/actions' ;
import { places } from '../constants/app';
import { isGameEnd } from '../tools/rules';


export default {
  load: function() {
    return {
      type: actions.LOAD_SCENARIO
    };
  },
  deal: function() {
    return function(dispatch, getState) {
      var batch = [];

      // Даем сигнал о старте раздачи карт
      batch.push({
        type  : actions.GAME_CREATED
      });

      // Раскладываем карты по стекам
      for (var i = 0; i < 7; i++) {
        for (var j = 0; j <= i; j++) {
          batch.push({
            flip          : i !== j,
            source        : places.DECK,
            source_index  : undefined,
            target        : places.STACK,
            target_index  : i,
            type          : actions.CARD_MOVE_BY_ENGINE
          });
        }
      }

      // Кладем одну в open
      batch.push({
        source        : places.DECK,
        source_index  : undefined,
        target        : places.OPEN,
        target_index  : undefined,
        type          : actions.CARD_MOVE_BY_ENGINE
      });

      // Даем сигнал о старте игры
      batch.push({
        type  : actions.GAME_START
      });

      batch.forEach(function(action, index) {
        setTimeout(function() {
          dispatch(action);
        }, 100*(index+1));
      });
    };
  },
  completeGame: function() {
    return function(dispatch, getState) {
      /**
       * Метод вычисляющий в какой хоум какую карту можно вкинуть.
       */
      let getHomeMap = function() {
        let homes = getState().board.homes;
        let ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '=', 'J', 'Q', 'K'];
        let map = {};
        homes.forEach(function(home, index) {
          // если этот дом еще не заполнен
          if (home.length !== 13) {
            let targetCard = home[home.length-1];
            map[index] = {
              rank: ranks[ranks.indexOf(targetCard[0])+1],
              suit: targetCard[1]
            };
          }
        });
        return map;
      };

      let cycleCount = 0;

      do {
        cycleCount++;
        if (cycleCount === 255) {
          console.log('Какая-то ошибка');
          return;
        }
        // открываем одну карту из колоды и кладем в open если можем
        let board = getState().board;
        if (board.deck.length) {
          dispatch({
            type: actions.CARD_OPEN_BY_PLAYER
          });
        }

        let map = getHomeMap();
        // ищем карты, подходящие для перемещения в дома
        Object.keys(map).forEach(function(index) {
          let wantedCard = map[index];
          let board = getState().board;

          if (board.open.length) {
            // смотрим верхнюю open карту
            let lastOpen = board.open[board.open.length - 1];
            if ((lastOpen[0] === wantedCard.rank) && (lastOpen[1] === wantedCard.suit)) {
              dispatch({
                card_id       : lastOpen,
                target_type   : places.HOME,
                target_index  : parseInt(index),
                type          : actions.CARD_MOVE_BY_PLAYER
              });
              return;
            }
          } else {
            // смотрим верхние карты стеков
            for (var i = 0; i < 7; i++) {
              let stack = board.stacks[i];
              if (stack.length) {
                let lastStack = stack[stack.length - 1];
                if ((lastStack[0] === wantedCard.rank) && (lastStack[1] === wantedCard.suit)) {
                  // FIXME придется этот action creator объявить в другом файле, чтобы через импорт-таки получить доступ к уже описанному action creator
                  dispatch({
                    card_id       : lastStack,
                    target_type   : places.HOME,
                    target_index  : parseInt(index),
                    type          : actions.CARD_MOVE_BY_PLAYER
                  });
                  return;
                }
              }
            }
          }
        }.bind(this));

      } while(!isGameEnd(getState().board.cards));
    }.bind(this);
  },
  revertTurn: function() {
    return {
      type: actions.REVERT
    };
  }
};
