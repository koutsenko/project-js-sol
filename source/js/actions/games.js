import actions from '../constants/actions';
import cPlaces from '../constants/places';

const shuffle = function(source) {
  var array = source.slice();
  var x, j,
      i = array.length;

  while (i) {
    //j = parseInt(Math.random() * i, 10);
    j = Math.round(Math.random() * i);
    i = i - 1;
    x = array[i];
    array[i] = array[j];
    array[j] = x;
  }
  return array;
};

const buildRandomDeckIds = function() {
  var cards = [];
  var suits = ['H', 'D', 'C', 'S'];
  var ranks = ['A', 'K', 'Q', 'J', '=', '9', '8', '7', '6', '5', '4', '3', '2'];
  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < ranks.length; j++) {
      cards.push(ranks[j]+suits[i]);
    }
  }

  return shuffle(cards);
};


export default {
  stackToHome: function(id, index) {
    return {
      id    : id,
      index : index,
      type  : actions.STACK_TO_HOME
    };
  },
  openToHome: function(index) {
    return {
      index   : index,
      type    : actions.OPEN_TO_HOME
    };
  },
  load: function() {
    return {
      type: actions.LOAD_SCENARIO
    };
  },
  deal: function() {
    return function(dispatch, getState) {
      let deck = buildRandomDeckIds();
      var batch = [];

      // Даем сигнал о старте раздачи карт
      batch.push({
        deck  : deck.slice(),
        type  : actions.NEW_GAME
      });

      // Раскладываем карты по стекам
      for (var i = 0; i < 7; i++) {
        for (var j = 0; j <= i; j++) {
          batch.push({
            index : i,
            type  : actions.DECK_TO_STACK
          });
        }
      }
      
      // Кладем одну в open
      batch.push({
        type  : actions.OPEN_CARD
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
  openCard: function() {
    return {
      type: actions.OPEN_CARD
    };
  },
  writeTurn: function(move) {
    return {
      type: actions.WRITE_TURN
    };
  },
  completeGame: function() {
    return function(dispatch, getState) {

      /**
       * Метод вычисляющий не закончилась ли игра.
       * Возможно надо переделать на тупо чтение признака конца игры.
       * Просто у меня пока еще нет такого поля в стейте.
       */
      let done = function() {
        let board = getState().gameCurrent.board;
        let length = 0;

        length += board.open.length;
        length += board.deck.length;
        for (var i = 0; i < 7; i++) {
          length += board.stacks[i].length;
        }

        return !length;
      };

      /**
       * Метод вычисляющий в какой хоум какую карту можно вкинуть.
       */
      let getHomeMap = function() {
        let homes = getState().gameCurrent.board.homes;
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
        let board = getState().gameCurrent.board;
        if (board.deck.length) {
          dispatch(this.openCard());          
        }

        let map = getHomeMap();
        // ищем карты, подходящие для перемещения в дома
        Object.keys(map).forEach(function(index) {
          let wantedCard = map[index];
          let board = getState().gameCurrent.board;

          if (board.open.length) {
            // смотрим верхнюю open карту
            let lastOpen = board.open[board.open.length - 1];
            if ((lastOpen[0] === wantedCard.rank) && (lastOpen[1] === wantedCard.suit)) {
              // FIXME придется этот action creator объявить в другом файле, чтобы через импорт-таки получить доступ к уже описанному action creator
              dispatch({
                index  : index,
                type   : actions.OPEN_TO_HOME
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
                    id      : lastStack,
                    index   : index,
                    type    : actions.STACK_TO_HOME
                  });
                  return;
                }
              }
            }
          }
        }.bind(this));

      } while(!done());
    }.bind(this);
  },
  revertTurn: function() {
    return {
      type: actions.REVERT
    };
  }
};
