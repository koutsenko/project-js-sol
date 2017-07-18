import constantsActions from 'constants/actions';

export default {
  open: function() {
    return {
      type: constantsActions.SHOW_RULES
    };
  },
  close: function() {
    return {
      type: constantsActions.CLOSE_RULES
    };
  }
};