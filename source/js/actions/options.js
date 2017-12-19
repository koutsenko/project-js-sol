import constantsActions from 'constants/actions';

export default {
  open: function() {
    return {
      type: constantsActions.SHOW_OPTIONS
    };
  },
  close: function() {
    return {
      type: constantsActions.CLOSE_OPTIONS
    };
  },
  toggleDnd: function(checked) {
    return {
      value: checked,
      type: constantsActions.OPTIONS_TOGGLE_DND
    }
  }
};
