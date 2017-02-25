import actions from '../constants/actions';

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

const buildRandomDeck = function() {
  var cards = [];
  var suits = ['H', 'D', 'C', 'S'];
  var ranks = ['A', 'K', 'Q', 'J', '=', '9', '8', '7', '6', '5', '4', '3', '2'];
  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < ranks.length; j++) {
      cards.push({
        rank: ranks[j],
        suit: suits[i],
        flip: true
      });
    }
  }

  cards = shuffle(cards);

  return cards;
};


export default {
  stackToHome: function(srcIndex, dstIndex) {
    return {
      dstIndex  : dstIndex,
      srcIndex  : srcIndex,
      type      : actions.STACK_TO_HOME
    };
  },
  openToHome: function(dstIndex) {
    return {
      dstIndex  : dstIndex,
      type      : actions.OPEN_TO_HOME
    };
  },
  deckToHome: function(dstIndex) {
    return {
      dstIndex  : dstIndex,
      type      : actions.DECK_TO_HOME
    };
  },
  load: function() {
    return {
      type: actions.LOAD_SCENARIO
    };
  },
  deal: function() {
    return function(dispatch, getState) {
      var batch = [];
      batch.push({
        type: actions.NEW_GAME
      });

      let deck = buildRandomDeck();
      // Раскладываем карты по стекам
      for (var i = 0; i < 7; i++) {
        for (var j = 0; j <= i; j++) {
          let card = deck.pop();
          if (i === j) {
            card.flip = false;
          };
          batch.push({
            card  : card,
            index : i,
            type  : actions.LAY_TO_STACK
          });
        }
      }

      let openedCard = deck.pop();
      openedCard.flip = false;
      batch.push({
        card  : openedCard,
        type  : actions.LAY_TO_OPEN
      });

      batch.push({
        cards : deck,
        type  : actions.LAY_TO_DECK
      });

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
              rank: ranks[ranks.indexOf(targetCard.rank)+1],
              suit: targetCard.suit
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
        // открываем один дом если можем
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
            if ((lastOpen.suit === wantedCard.suit) && (lastOpen.rank === wantedCard.ranks)) {
              // FIXME придется этот action creator объявить в другом файле, чтобы через импорт-таки получить доступ к уже описанному action creator
              dispatch({
                dstIndex  : index,
                type      : actions.OPEN_TO_HOME
              });
              return;
            }
          } else if (board.deck.length) {
            // смотрим верхнюю deck карту
            let lastDeck = board.deck[board.deck.length - 1];
            if ((lastDeck.suit === wantedCard.suit) && (lastDeck.rank === wantedCard.rank)) {
              // FIXME придется этот action creator объявить в другом файле, чтобы через импорт-таки получить доступ к уже описанному action creator
              dispatch({
                dstIndex  : index,
                type      : actions.DECK_TO_HOME
              });
              return;
            }
          } else {
            // смотрим верхние карты стеков
            for (var i = 0; i < 7; i++) {
              let stack = board.stacks[i];
              if (stack.length) {
                let lastStack = stack[stack.length - 1];
                if ((lastStack.suit === wantedCard.suit) && (lastStack.rank === wantedCard.rank)) {
                  // FIXME придется этот action creator объявить в другом файле, чтобы через импорт-таки получить доступ к уже описанному action creator
                  dispatch({
                    dstIndex  : index,
                    srcIndex  : i,
                    type      : actions.STACK_TO_HOME
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
