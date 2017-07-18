import constantsActions from 'constants/actions';

export default {
  open: function() {
    return {
      type: constantsActions.SHOW_ABOUT
    };
  },
  close: function() {
    return {
      type: constantsActions.CLOSE_ABOUT
    };
  }
};