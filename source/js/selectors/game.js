import { createSelector } from 'reselect';

const resultFunc = (game) => game;

const getCurrentGame = (gameState) => gameState.byId[gameState.allIds[gameState.allIds.length -1]];

export default {
  getCurrentGame  : createSelector([getCurrentGame], resultFunc)
};