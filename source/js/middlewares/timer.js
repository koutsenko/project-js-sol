import constantsActions from '../constants/actions';

export default function(store) {
  var getState = store.getState;
  var timer;

  return function(next) {
    return function(action) {
      let returnValue = next(action);
      switch (action.type) {
        case constantsActions.GAME_START:
        case constantsActions.LOAD_SCENARIO:
          clearInterval(timer);
          timer = setInterval(function() {
            store.dispatch({
              type: constantsActions.TICK
            });
          }, 1000);
          break;
        case constantsActions.GAME_END:
        case constantsActions.GAME_CREATED:
          clearInterval(timer);
          break;
      }

      return returnValue;
    };
  };
};
