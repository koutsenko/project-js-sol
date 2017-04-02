import actions from '../constants/actions';

export default {
  open: function() {
    return {
      type: actions.SHOW_ABOUT
    };
  },
  close: function() {
    return {
      type: actions.CLOSE_ABOUT
    };
  }
}