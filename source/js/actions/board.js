import constantsActions from 'constants/actions' ;
import constantsBoard   from 'constants/board'   ;
import selectorsBoard   from 'selectors/board'   ;
import toolsRules       from 'tools/rules'       ;

let flushWrongHighlight = function() {
  return function(dispatch, getState) {
    dispatch({
      type: constantsActions.FLUSH_WRONG_HIGHLIGHT
    });
  };
};

let flushDecline = function() {
  return function(dispatch, getState) {
    dispatch({
      type: constantsActions.FLUSH_DECLINE
    });
  };
};

let cardSelectCancel = function() {
  return function(dispatch, getState) {
    dispatch({
      type: constantsActions.CARD_SELECT_CANCEL_BY_PLAYER
    });
  };
};

let cardSelectOk = function(card) {
  return function(dispatch, getState) {
    dispatch({
      id: card.id,
      type: constantsActions.CARD_SELECT_OK_BY_PLAYER
    });
  };
};

let cardSelectFail = function(card) {
  return function(dispatch, getState) {
    dispatch({
      id: card.id,
      type: constantsActions.CARD_SELECT_FAIL_BY_PLAYER
    });
  };
};

let cardDrop = function(id) {
  return function(dispatch, getState) {
    let state         =  getState();
    let holderId      = selectorsBoard.getHolderId(id, state.board);
    let target_type   = holderId || constantsBoard.mapClassToPlace[id];
    let target_holder = state.board.holders.byId[target_type];

    // FIXME топорный поиск выбранной карты...
    let selectedIds   = Object.keys(state.board.selected);
    let selectedId;
    for (var i = 0; i < selectedIds.length; i++) {
      if (state.board.selected[selectedIds[i]] === constantsBoard.highlights.ACCEPT) {
        selectedId = selectedIds[i];
        break;
      }
    }
    let source = state.board.cards.byId[selectedId];
    let target = target_holder.length ? state.board.cards.byId[target_holder[target_holder.length - 1]] : undefined;

    if ((constantsBoard.isStackPlace(target_type) && toolsRules.canAcceptDropToStack(source, target)) || (constantsBoard.isHomePlace(target_type) && toolsRules.canAcceptDropToHome(source, target))) {
      dispatch({
        card_id       : source.id,
        target_type   : target_type,
        type          : constantsActions.CARD_MOVE_BY_PLAYER
      });
    } else {
      dispatch({
        holder_id     : constantsBoard.mapPlaceToClass[target_type],
        type          : constantsActions.CARD_TARGET_WRONG_BY_PLAYER
      })
    }
  }
};

let deckClick = function() {
  return function(dispatch, getState) {
    dispatch({
      type: constantsActions.CARD_BACK_BY_PLAYER
    });
  };
};

let deckCardClick = function() {
  return function(dispatch, getState) {
    let state = getState();
    let holder = state.board.holders.byId[constantsBoard.places.DECK];
    let card_id = holder[holder.length - 1];
    dispatch({
      card_id     : card_id,
      target_type : constantsBoard.places.OPEN,
      type        : constantsActions.CARD_MOVE_BY_PLAYER
    });
  };
};

let cardDoubleClick = function(id) {
  return function(dispatch, getState) {
    let state = getState();
    let homes = constantsBoard.getHomePlaces();
    for (var i = 0; i < homes.length; i++) {
      let source = state.board.cards.byId[id];
      let target_holder = state.board.holders.byId[homes[i]];
      let target = target_holder.length ? state.board.cards.byId[target_holder[target_holder.length - 1]] : undefined;
      if (toolsRules.canAcceptDropToHome(source, target)) {
        dispatch({
          card_id       : id,
          target_type   : homes[i],
          type          : constantsActions.CARD_MOVE_BY_PLAYER
        });
        break;
      }
    }
  }
};

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