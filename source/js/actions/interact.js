import   actions  from '../constants/actions';
import { places } from '../constants/app';
import   gamesAC  from './games';

export default {
  dragEndCard: function() {
    return {
      type  : actions.DRAG_END_CARD
    };
  },
  dragEnterCard: function(drag_card_id, drop_card_id) {
    return function(dispatch, getState) {
      console.log('карту накрыло');
      let state = getState();
      let target = state.board.cards[drop_card_id];
      if (target.place.owner.type === places.DECK) {
        return;
      }
      let source = state.board.cards[drag_card_id];
      let owner_index = target.place.owner.index;
      let owner = {
        [places.OPEN]   : state.board.open,
        [places.STACK]  : state.board.stacks[owner_index],
        [places.HOME]   : state.board.homes[owner_index]
      }[target.place.owner.type];
      let last = state.board.cards[owner[owner.length-1]];
      console.log('нашли верхнюю карту в том месте где накрытая и на нее диспатчим');
      dispatch({
        source: source,
        target: last,
        type: actions.DRAG_ENTER_CARD
      });
    };
  },
  dragLeaveCard: function(drag_card_id, drop_card_id) {
    return function(dispatch, getState) {
      console.log('карту отпустило');
      let state = getState();
      let target = state.board.cards[drop_card_id];
      if (target.place.owner.type === places.DECK) {
        return;
      }
      let source = state.board.cards[drag_card_id];
      let owner_index = target.place.owner.index;
      let owner = {
        [places.OPEN]   : state.board.open,
        [places.STACK]  : state.board.stacks[owner_index],
        [places.HOME]   : state.board.homes[owner_index]
      }[target.place.owner.type];
      let last = state.board.cards[owner[owner.length-1]];
      console.log('нашли верхнюю карту в том месте где накрытая и на нее диспатчим');
      dispatch({
        source: source,
        target: last,
        type: actions.DRAG_LEAVE_CARD
      });
    };
  },
  dragEnterHome: function(id, index) {
    return function(dispatch, getState) {
      let state = getState();
      let card = state.board.cards[id];
      dispatch({
        source        : card,
        target_index  : index,
        type          : actions.DRAG_ENTER_HOME
      });
    }
  },
  dragLeaveHome: function(id, index) {
    return function(dispatch, getState) {
      dispatch({
        index : index,
        type  : actions.DRAG_LEAVE_HOME
      });
    };
  },
  dragEnterStack: function(id, index) {
    return function(dispatch, getState) {
      let state = getState();
      let card = state.board.cards[id];
      dispatch({
        source        : card,
        target_index  : index,
        type          : actions.DRAG_ENTER_STACK
      });
    };
  },
  dragLeaveStack: function(id, index) {
    return function(dispatch, getState) {
      dispatch({
        index : index,
        type  : actions.DRAG_LEAVE_STACK
      });
    };
  }
}