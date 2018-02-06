/* eslint-disable no-var */
import actions from 'constants/actions';

export default function(state, action) {
  if (state === undefined) {
    const records     = localStorage.getItem('m3w-sol-records');
    const gamesCount  = localStorage.getItem('m3w-sol-games-count');
    const winsCount   = localStorage.getItem('m3w-sol-wins-count');

    state = {
      gamesCount      : parseInt(gamesCount) || 0,   /** Общее кол-во сыгранных игр   */
      records         : records ? JSON.parse(records) : [],  /** Рекорды                      */
      winsCount       : parseInt(winsCount)   || 0    /** Общее кол-во выигранных игр  */
    }
  }

  var newState;

  switch (action.type) {
    case actions.NEW_RECORD:
      newState = JSON.parse(JSON.stringify(state));
      newState.records.splice(action.index, 0, action.record);
      if (newState.records.length === 6) {
        newState.records.pop();
      }
      return newState;

    case actions.LOAD_SCENARIO:
    case actions.GAME_START:
      newState = JSON.parse(JSON.stringify(state));
      newState.gamesCount++;
      return newState;

    case actions.GAME_COMPLETE:
      newState = JSON.parse(JSON.stringify(state));
      newState.winsCount++;
      return newState;
  }

  return state;
}
