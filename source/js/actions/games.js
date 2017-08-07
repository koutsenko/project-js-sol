import constantsActions from '../constants/actions' ;
import constantsBoard   from '../constants/board'   ;
import selectorsBoard   from '../selectors/board'   ;
import selectorsGame    from '../selectors/game'    ;
import toolsRules       from '../tools/rules'       ;

export default {
  load: function(data) {
    return {
      data: data,
      type: constantsActions.LOAD_SCENARIO
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
      let source  = selectorsBoard.getDeckCards(state).slice();

      // Раскладываем карты по стекам
      for (var i = 0; i < 7; i++) {
        for (var j = 0; j <= i; j++) {
          let card = source.pop();
          batch.push({
            card_id       : card.id,
            flip          : i !== j,
            target_type   : constantsBoard.places['STACK' + (i+1)],
            type          : constantsActions.CARD_MOVE_BY_ENGINE
          });
        }
      }

      // Кладем одну в open
      let card = source.pop();
      batch.push({
        card_id       : card.id,
        flip          : false,
        target_type   : constantsBoard.places.OPEN,
        type          : constantsActions.CARD_MOVE_BY_ENGINE
      });

      // Даем сигнал о старте игры
      batch.push({
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
      let game = selectorsGame.getCurrentGame(state);
      let opened = state.board.cards.allIds.filter(function(id) {
        return !state.board.cards.byId[id].flip
      });
      let data = {
        board: {
          holders : state.board.holders,
          index   : state.board.index
        },
        time    : game.time,
        opened  : opened,
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
        let map = toolsRules.getHomeMap(getState());

        // смотрим последние карты стеков и open
        let lastCards = constantsBoard.getStackPlaces().map(function(place) {
          let holder = getState().board.holders.byId[place];
          return holder.length ? holder[holder.length-1] : undefined;
        }).filter(function(card_id){
          return card_id !== undefined;
        });
        let openHolder = getState().board.holders.byId[constantsBoard.places.OPEN];
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
          let deckHolder = getState().board.holders.byId[constantsBoard.places.DECK];
          let openHolder = getState().board.holders.byId[constantsBoard.places.OPEN];
          if (deckHolder.length) {
            dispatch({
              card_id     : deckHolder[deckHolder.length - 1],
              target_type : constantsBoard.places.OPEN,
              type        : constantsActions.CARD_MOVE_BY_PLAYER
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
                card_id       : id,
                target_type   : constantsBoard.places['HOME'+(parseInt(home_index)+1)],
                type          : constantsActions.CARD_MOVE_BY_PLAYER
              });
            }
          });
        }); 
      } while(!toolsRules.isGameEnd(getState().board.cards.byId));
    }.bind(this);
  },
  revertTurn: function() {
    return {
      type: constantsActions.REVERT
    };
  }
};
