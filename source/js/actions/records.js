import constantsActions from 'constants/actions';

export default {
  open: function() {
    return {
      type: constantsActions.SHOW_RECORDS
    };
  },
  close: function() {
    return {
      type: constantsActions.CLOSE_RECORDS
    };
  },
  write: function(record) {
    return function(dispatch, getState) {
      var state = getState();
      var isWeak = true;
      for (var i = 0; i < state.stats.records.length; i++) {
        if ((state.stats.records[i].moves < record.moves) || ((state.stats.records[i].moves === record.moves) && (state.stats.records[i].time > record.time))) {
          // Побили чей-то рекорд, отправляем заявку
          dispatch({
            index   : i,
            record  : record,
            type    : constantsActions.NEW_RECORD
          });
          isWeak = false;
          break;
        }
      }
      // Ничей рекорд не побили, но есть еще незанятые места
      if (isWeak && state.stats.records.length < 5) {
        dispatch({
          index   : state.stats.records.length,
          record  : record,
          type    : constantsActions.NEW_RECORD
        });
        isWeak = false;
      }

      // Увы... фальшрекорд
      if (isWeak) {
        dispatch({
          record  : record,
          type    : constantsActions.WEAK_RECORD
        });
      }
    };
  }
};