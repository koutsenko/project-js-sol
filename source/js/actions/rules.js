import constantsActions from 'constants/actions';

export default {
  open: () => ({
    type: constantsActions.SHOW_RULES
  }),
  close: () => ({
    type: constantsActions.CLOSE_RULES
  })
};
