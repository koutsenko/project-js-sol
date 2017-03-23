import actions from '../constants/actions';

export default function(store) {
  var getState = store.getState;

  return function(next) {
    return function(action) {
      let returnValue = next(action);
      let state = getState();
      if (action.type === actions.NEW_RECORD) {
        localStorage.setItem('m3w-sol-records', JSON.stringify(state.stats.records));
      } else if (action.type === actions.LOAD_SCENARIO) {
        localStorage.setItem('m3w-sol-games-count', state.stats.gamesCount);
      } else if (action.type === actions.GAME_END) {
        localStorage.setItem('m3w-sol-wins-count', state.stats.winsCount);
      }
      return returnValue;
    };
  };
};