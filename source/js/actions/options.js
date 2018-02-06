import constantsActions from 'constants/actions';

export default {
  open: () => ({
    type: constantsActions.SHOW_OPTIONS
  }),
  close: () => ({
    type: constantsActions.CLOSE_OPTIONS
  }),
  toggleDnd: (checked) => ({
    value: checked,
    type: constantsActions.OPTIONS_TOGGLE_DND
  })
};
