import   actions  from '../constants/actions';
import { places } from '../constants/app';
import   gamesAC  from './games';

export default {
  dragEndCard: function() {
    return {
      type  : actions.DRAG_END_CARD
    };
  },
  dragEnterHome: function(id, index) {
    // помним что этот AC будет потом вызываться и дропзоной карты тоже...
    return function(dispatch, getState) {
      let state = getState();
      var home = state.board.homes[index];
      let card = state.board.cards[id];
      if (home.length === 0) {
        dispatch({
          source        : card,
          target_index  : index,
          type          : actions.DRAG_ENTER_HOME
        });
      } else {
        let last = state.board.cards[home[home.length-1]];
        if (last.id !== id) {
          dispatch({
            source : card,
            target : last,
            type   : actions.DRAG_ENTER_CARD
          });
        }
      }
    }
  },
  dragLeaveHome: function(id, index) {
    return function(dispatch, getState) {
      let state = getState();
      var home = state.board.homes[index];
      if (home.length === 0) {
        dispatch({
          index : index,
          type  : actions.DRAG_LEAVE_HOME
        });
      } else {
        let last = state.board.cards[home[home.length-1]];
        if (last.id !== id) {
          dispatch({
            target_id : last.id,
            type      : actions.DRAG_LEAVE_CARD
          });
        }
      }
    }
  },
  dragEnterStack: function(id, index) {
    return function(dispatch, getState) {
      let state = getState();
      let stack = state.board.stacks[index];
      let card = state.board.cards[id];
      if (stack.length === 0) {
        dispatch({
          source        : card,
          target_index  : index,
          type          : actions.DRAG_ENTER_STACK
        });
      } else {
        let last = state.board.cards[stack[stack.length-1]];
        if (last.id !== id) {
          dispatch({
            source : card,
            target : last,
            type   : actions.DRAG_ENTER_CARD
          });
        }
      }
    }
  },
  dragLeaveStack: function(id, index) {
    return function(dispatch, getState) {
      let state = getState();
      let stack = state.board.stacks[index];
      if (stack.length === 0) {
        dispatch({
          index : index,
          type  : actions.DRAG_LEAVE_STACK
        });
      } else {
        let last = state.board.cards[stack[stack.length-1]];
        if (last.id !== id) {
          dispatch({
            target_id : last.id,
            type      : actions.DRAG_LEAVE_CARD
          });
        }
      }
    }
  }
}