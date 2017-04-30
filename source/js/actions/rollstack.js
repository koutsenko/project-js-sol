import actions from '../constants/actions';

export default {
  start: function(holderType, holderIndex, cardId) {
    return {
      id      : cardId,
      htype   : holderType,
      hindex  : holderIndex,
      type    : actions.ROLL_START
    };
  },
  change: function(delta) {
    return function(dispatch, getState) {
      dispatch({
        delta : delta,
        type  : actions.ROLL_CHANGE
      });
    }
  },
  cancel: function() {
    return {
      type    : actions.ROLL_CANCEL
    };
  },
  continue: function(holderType, holderIndex) {
    return {
      htype   : holderType,
      hindex  : holderIndex,
      type    : actions.ROLL_END
    };
  }
};