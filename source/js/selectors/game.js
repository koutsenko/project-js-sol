import { createSelector } from 'reselect';

const resultFunc = (game) => game;

const getCurrentGame = (state) => state.game.byId[state.game.allIds[state.game.allIds.length -1]];

export default {
  getCurrentGame  : createSelector([getCurrentGame], resultFunc)
};