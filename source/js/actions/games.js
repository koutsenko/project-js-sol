import   actions      from '../constants/actions' ;
import { places } from '../constants/app';
import { isGameEnd } from '../tools/rules';


export default {
  load: function(data) {
    return {
      data: data,
      type: actions.LOAD_SCENARIO
    };
  },
  deal: function(seed) {
    return function(dispatch, getState) {
      // Даем сигнал о старте раздачи карт - это подготовит колоду
      dispatch({
        seed  : seed,
        type  : actions.GAME_CREATED
      });

      let state   = getState();
      let batch   = [];
      let source  = state.board.deck.slice();

      // Раскладываем карты по стекам
      for (var i = 0; i < 7; i++) {
        for (var j = 0; j <= i; j++) {
          batch.push({
            card_id       : source.pop(),
            flip          : i !== j,
            target_type   : places.STACK,
            target_index  : i,
            type          : actions.CARD_MOVE_BY_ENGINE
          });
        }
      }

      // Кладем одну в open
      batch.push({
        card_id       : source.pop(),
        flip          : false,
        target_type   : places.OPEN,
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
  dump: function() {
    return function(dispatch, getState) {
      let state = getState();
      let opened = [];
      Object.keys(state.board.cards).forEach(function(id) {
        if (!state.board.cards[id].flip) {
          opened.push(id);
        };
      });
      let data = {
        board: {
          stacks  : state.board.stacks,
          homes   : state.board.homes,
          deck    : state.board.deck,
          open    : state.board.open,
          index   : state.board.index
        },
        time    : state.game.time,
        opened  : opened,
      };
      setTimeout(function() {
        alert(encodeURI(JSON.stringify(data)));
      }.bind(this), 0);      
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
        let freeSuits = ['H', 'C', 'D', 'S'];
        let map = {};
        homes.forEach(function(home, index) {
          if (home[0] !== undefined) {
            freeSuits.splice(freeSuits.indexOf(home[0][1]), 1);
          }
        });
        homes.forEach(function(home, index) {
          // если этот дом еще не заполнен
          if (home.length !== 13) {
            let last = home[home.length-1];
            if (last === undefined) {
              map[index] = {
                rank: 'A',
                suit: freeSuits[0]
              }
              freeSuits.splice(0, 1);
            } else {
              map[index] = {
                rank: ranks[ranks.indexOf(last[0])+1],
                suit: last[1]
              };
            }
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
        // открываем карту из deck и кладем в open если можем, если надо - возвращаем open в deck
        let board = getState().board;
        if (board.deck.length) {
          dispatch({
            card_id     : board.deck[board.deck.length - 1],
            target_type : places.OPEN,
            type        : actions.CARD_MOVE_BY_PLAYER
          });
        } else if (board.open.length) {
          dispatch({
            type: actions.CARD_BACK_BY_PLAYER
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
