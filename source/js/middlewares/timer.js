import actions from '../constants/actions';

export default function(store) {
  var getState = store.getState;
  var timer;

  return function(next) {
    return function(action) {
      let returnValue = next(action);
      switch (action.type) {
        case actions.GAME_START:
        case actions.LOAD_SCENARIO:
          clearInterval(timer);
          timer = setInterval(function() {
            store.dispatch({
              type: actions.TICK
            });
          }, 1000);
          break;
        case actions.GAME_END:
        case actions.GAME_CREATED:
          clearInterval(timer);
          break;
      }

      return returnValue;
    };
  };
};
