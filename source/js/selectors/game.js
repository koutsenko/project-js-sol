import { createSelector }       from 'reselect'         ;
import   createCachedSelector   from 're-reselect'      ;
import   seedRandom             from 'seed-random'      ;

import   constantsBoard         from 'constants/board'  ;

const getCardSeeds = createCachedSelector(
  (seed) => seed,
  function(seed) {
    let seedFn = function(seed, seedModifier, dispersion) {
      return Math.round((seedRandom(seed.toString()+seedModifier)()-0.5) * dispersion);
    }
    let result = {};
    constantsBoard.cards.forEach(function(cardId) {
      result[cardId] = {
        x: seedFn(seed, 'A'+cardId, 9), // это теперь проценты!
        y: seedFn(seed, 'B'+cardId, 9), // это теперь проценты!
        r: seedFn(seed, 'C'+cardId, 5)  // это градусы как и было
      };
    });

    return result;
  }
)(
  (seed) => seed
);

const getCurrentGame = createSelector(
  gameState => gameState.byId[gameState.allIds[gameState.allIds.length -1]],
  game      => game
);

export default {
  getCurrentGame  : getCurrentGame,
  getCardSeeds    : getCardSeeds
};
