/**
 * Важный action creator.
 * Мост между пользовательскими действиями и движком.
 */
import actions from '../constants/actions';
import { places, highlights} from '../constants/app';
import { canAcceptDropToStack, canAcceptDropToHome } from '../tools/rules';

let flushWrongHighlight = function() {
  return function(dispatch, getState) {
    dispatch({
      type: actions.FLUSH_WRONG_HIGHLIGHT
    });
  };
};

let flushDecline = function() {
  return function(dispatch, getState) {
    dispatch({
      type: actions.FLUSH_DECLINE
    });
  };
};

let cardSelectCancel = function() {
  return function(dispatch, getState) {
    dispatch({
      type: actions.CARD_SELECT_CANCEL_BY_PLAYER
    });
  };
};

let cardSelectOk = function(card) {
  return function(dispatch, getState) {
    dispatch({
      id: card.id,
      type: actions.CARD_SELECT_OK_BY_PLAYER
    });
  };
};

let cardSelectFail = function(card) {
  return function(dispatch, getState) {
    dispatch({
      id: card.id,
      type: actions.CARD_SELECT_FAIL_BY_PLAYER
    });
  };
};

let cardDrop = function(id) {
  return function(dispatch, getState) {
    let state = getState();
    let holder_id;

    let card = state.board.cards[id];
    if (card) {
      let mapPlaceToClass = {
        [places.DECK  ]  : 'd',
        [places.OPEN  ]  : 'o',
        [places.STACK ]  : 's',
        [places.HOME  ]  : 'h'
      };
      holder_id = mapPlaceToClass[card.place.owner.type] + (card.place.owner.index !== undefined ? card.place.owner.index : '');
    } else {
      holder_id = id;
    }

    let mapClassToPlace = {
      'd': places.DECK,
      'o': places.OPEN,
      's': places.STACK,
      'h': places.HOME
    };

    let mapPlaceToHolder = {
      [places.STACK]  : state.board.stacks,
      [places.HOME]   : state.board.homes,
      [places.DECK]   : state.board.deck,
      [places.OPEN]   : state.board.open,
    };

    let target_type   = mapClassToPlace[holder_id[0]];
    let target_index  = holder_id[1];
    let target_holder = (target_index === undefined) ? mapPlaceToHolder[target_type] : mapPlaceToHolder[target_type][target_index];

    // FIXME топорный поиск выбранной карты...
    let selectedIds   = Object.keys(state.board.selected);
    let selectedId;
    for (var i = 0; i < selectedIds.length; i++) {
      if (state.board.selected[selectedIds[i]] === highlights.ACCEPT) {
        selectedId = selectedIds[i];
        break;
      }
    }
    let source = state.board.cards[selectedId];
    let target = target_holder.length ? state.board.cards[target_holder[target_holder.length - 1]] : undefined;

    if (((target_type === places.STACK) && canAcceptDropToStack(source, target)) || ((target_type === places.HOME) && canAcceptDropToHome(source, target))) {
      dispatch({
        card_id       : source.id,
        target_index  : target_index,
        target_type   : target_type,
        type          : actions.CARD_MOVE_BY_PLAYER
      });
    } else {
      dispatch({
        holder_id     : holder_id,
        type          : actions.CARD_TARGET_WRONG_BY_PLAYER
      })
    }
  }
};

let deckClick = function() {
  return function(dispatch, getState) {
    dispatch({
      type: actions.CARD_BACK_BY_PLAYER
    });
  };
};

let deckCardClick = function() {
  return function(dispatch, getState) {
    let state = getState();
    let card_id = state.board.deck[state.board.deck.length - 1];
    dispatch({
      card_id     : card_id,
      target_type : places.OPEN,
      type        : actions.CARD_MOVE_BY_PLAYER
    });
  };
};

let cardDoubleClick = function(id) {
  return function(dispatch, getState) {
    let state = getState();
    for (var i = 0; i < 4; i++) {
      let source = state.board.cards[id];
      let target_index = i;
      let target_holder = state.board.homes[target_index];
      let target = target_holder.length ? state.board.cards[target_holder[target_holder.length - 1]] : undefined;
      if (canAcceptDropToHome(source, target)) {
        dispatch({
          card_id       : id,
          target_index  : target_index,
          target_type   : places.HOME,
          type          : actions.CARD_MOVE_BY_PLAYER
        });
        break;
      }
    }
  }
}

export default { 
  cardSelectOk        ,
  cardSelectCancel    ,
  cardSelectFail      ,
  cardDoubleClick     ,
  cardDrop            ,
  deckClick           ,
  deckCardClick       ,
  flushDecline        ,
  flushWrongHighlight
};