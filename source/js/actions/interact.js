import actions from '../constants/actions';
import cPlaces from '../constants/places';
import gamesAC from './games';

const canAcceptDropToStack = function(draggingCardId, dropzoneCardId) {
  if (dropzoneCardId === undefined) {
    return draggingCardId[0] === 'K';
  } else {
    let ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '=', 'J', 'Q', 'K'];
    let suits = [undefined, 'H', 'S', 'D', 'C'];
    let rankRule = (ranks.indexOf(draggingCardId[0])+1) === (ranks.indexOf(dropzoneCardId[0]));
    let suitRule = (suits.indexOf(draggingCardId[1]) + suits.indexOf(dropzoneCardId[1])) % 2;
    return rankRule && suitRule;
  }
};

const canAcceptDropToHome = function(draggingCardId, dropzoneCardId) {
  if (dropzoneCardId === undefined) {
    return draggingCardId[0] === 'A';
  } else {
    let ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '=', 'J', 'Q', 'K'];
    let rankRule = ranks.indexOf(draggingCardId[0]) === (ranks.indexOf(dropzoneCardId[0])+1);
    let suitRule = draggingCardId[1] === dropzoneCardId[1];
    return rankRule && suitRule;
  }
};

export default {
  dropHome: function(id, index) {
    return function(dispatch, getState) {
      let state = getState();
      let home = state.gameCurrent.board.homes[index];
      let last = home.length ? state.gameCurrent.cards[home[home.length-1]] : undefined;
      let card = state.gameCurrent.cards[id];
      if (last) {
        // на дропзоне дома есть карты - анализируем карту
        if (state.accepts.card[last.id]) {
          console.log('да, можно дропать');
          let af = {
            [cPlaces.STACK] : 'stackToHome',
            [cPlaces.OPEN]  : 'openToHome'
          }[card.place.owner.type];

          dispatch(gamesAC[af](id, index));
        } else {
          console.log('нет, нельзя дропать');
        }
      } else {
        // на дропзоне дома нет карт - анализируем дропзону
        if (state.accepts.home[index]) {
          console.log('да, можно дропать');
          console.log('этот кейс (дроп туза на пустой дом) мы обрабатываем в первую очередь, т.к. его щас реально будет проверить');
          let af = {
            [cPlaces.STACK] : 'stackToHome',
            [cPlaces.OPEN]  : 'openToHome'
          }[card.place.owner.type];

          dispatch(gamesAC[af](id, index));
        } else {
          console.log('нет, нельзя дропать');
        }
      }
    };
  },
  dragEndCard: function() {
    return {
      type  : actions.DRAG_END_CARD
    };
  },
  dragEnterHome: function(id, index) {
    return function(dispatch, getState) {
      let state = getState();
      var home = state.gameCurrent.board.homes[index];
      if (home.length === 0) {
        dispatch({
          index : index,
          type  : actions.DRAG_ENTER_HOME,
          value : canAcceptDropToHome(id)
        });
      } else {
        let last = state.gameCurrent.cards[home[home.length-1]];
        if (last.id !== id) {
          dispatch({
            id    : last.id,
            type  : actions.DRAG_ENTER_CARD,
            value : canAcceptDropToHome(id, last.id)
          });
        }
      }
    }
  },
  dragLeaveHome: function(id, index) {
    return function(dispatch, getState) {
      let state = getState();
      var home = state.gameCurrent.board.homes[index];
      if (home.length === 0) {
        dispatch({
          index : index,
          type  : actions.DRAG_LEAVE_HOME
        });
      } else {
        let last = state.gameCurrent.cards[home[home.length-1]];
        if (last.id !== id) {
          dispatch({
            id    : last.id,
            type  : actions.DRAG_LEAVE_CARD
          });
        }
      }
    }
  },
  dragEnterStack: function(id, index) {
    return function(dispatch, getState) {
      let state = getState();
      var stack = state.gameCurrent.board.stacks[index];
      if (stack.length === 0) {
        dispatch({
          index : index,
          type  : actions.DRAG_ENTER_STACK,
          value : canAcceptDropToStack(id)
        });
      } else {
        let last = state.gameCurrent.cards[stack[stack.length-1]];
        if (last.id !== id) {
          dispatch({
            id    : last.id,
            type  : actions.DRAG_ENTER_CARD,
            value : canAcceptDropToStack(id, last.id)
          });
        }
      }
    }
  },
  dragLeaveStack: function(id, index) {
    return function(dispatch, getState) {
      let state = getState();
      let stack = state.gameCurrent.board.stacks[index];
      if (stack.length === 0) {
        dispatch({
          index : index,
          type  : actions.DRAG_LEAVE_STACK
        });
      } else {
        let last = state.gameCurrent.cards[stack[stack.length-1]];
        if (last.id !== id) {
          dispatch({
            id    : last.id,
            type  : actions.DRAG_LEAVE_CARD
          });
        }
      }
    }
  }
}