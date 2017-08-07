import tsRandom         from 'uuid/v1'              ;

import constantsActions from '../constants/actions' ;
import gameConstants    from '../constants/game'    ;

export default function(state, action) {
  if (state === undefined) {
    state = {
      allIds  : [],
      byId    : {}
    };
  }

  switch (action.type) {
    case constantsActions.GAME_CREATED:
      var newState = JSON.parse(JSON.stringify(state));
      var id = tsRandom();
      newState.allIds.push(id);
      newState.byId[id] = {
        id                : id,
        index             : undefined,  // Выигранная сейчас игра - место в таблице рекордов, 0-4 для рекорда, 5 для нерекорда
        result            : undefined,  // Выигранная сейчас игра - результат
        controlsEnabled   : false,
        time              : 0,
        status            : gameConstants.gameState.GAME_CREATED
      };
      return newState;  
          
    case constantsActions.LOAD_SCENARIO: // сигнал о загрузке сохраненки, он пока что обходится без анимации и поэтому controlsEnabled = true. TODO - переосмыслить...
      var newState = JSON.parse(JSON.stringify(state));
      var id = tsRandom();
      newState.allIds.push(id);
      newState.byId[id] = {
        id                : id,
        index             : undefined,  // Выигранная сейчас игра - место в таблице рекордов, 0-4 для рекорда, 5 для нерекорда
        result            : undefined,  // Выигранная сейчас игра - результат
        controlsEnabled   : true,
        time              : JSON.parse(decodeURI(action.data)).time,
        status            : gameConstants.gameState.STATE_STARTED
      };
      return newState;

    case constantsActions.GAME_START:    // сигнал об окончании раздачи и старте игры
      var newState = JSON.parse(JSON.stringify(state));
      var id = newState.allIds[newState.allIds.length-1];
      newState.byId[id].status            = gameConstants.gameState.STATE_STARTED;
      newState.byId[id].controlsEnabled   = true;
      return newState;

    case constantsActions.GAME_COMPLETE:      // конец игры, между играми делать ничего нельзя, TODO - это имеются в виду BOARD controls. Переосмыслить. Вероятно надо делать ч/б затененную доску
      var newState = JSON.parse(JSON.stringify(state));
      var id = newState.allIds[newState.allIds.length-1];
      newState.byId[id].status = gameConstants.gameState.STATE_COMPLETED;
      return newState;
    
    case constantsActions.WEAK_RECORD:
      var newState = JSON.parse(JSON.stringify(state));
      var id = newState.allIds[newState.allIds.length-1];
      newState.byId[id].result = action.record;
      newState.byId[id].index = 5;
      return newState;

    case constantsActions.NEW_RECORD:
      var newState = JSON.parse(JSON.stringify(state));
      var id = newState.allIds[newState.allIds.length-1];
      newState.byId[id].result = action.record;
      newState.byId[id].index = action.index;
      return newState;

    case constantsActions.TICK:
      var newState = JSON.parse(JSON.stringify(state));
      var id = newState.allIds[newState.allIds.length-1];
      newState.byId[id].time++;
      return newState;
  }

  return state;
};
