import tsRandom         from 'uuid/v1'            ;

import constantsActions from 'constants/actions'  ;
import gameConstants    from 'constants/game'     ;

export default function(state, action) {
  if (state === undefined) {
    state = {
      allIds  : [],
      byId    : {}
    };
  }

  var newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case constantsActions.GAME_CREATED:
      var id = tsRandom();
      newState.allIds.push(id);
      newState.byId[id] = {
        id                : id,
        index             : undefined,  // Выигранная сейчас игра - место в таблице рекордов, 0-4 для рекорда, 5 для нерекорда
        result            : undefined,  // Выигранная сейчас игра - результат
        controlsEnabled   : false,
        time              : undefined,
        status            : gameConstants.gameState.GAME_CREATED
      };
      break;

    case constantsActions.GAME_END:
      var id = newState.allIds[newState.allIds.length-1];      
      newState.byId[id] = {
        time              : undefined
      };
      break;
          
    case constantsActions.LOAD_SCENARIO: // сигнал о загрузке сохраненки, он пока что обходится без анимации и поэтому controlsEnabled = true. TODO - переосмыслить...
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
      break;

    case constantsActions.GAME_START:    // сигнал об окончании раздачи и старте игры
      var id = newState.allIds[newState.allIds.length-1];
      newState.byId[id].status            = gameConstants.gameState.STATE_STARTED;
      newState.byId[id].controlsEnabled   = true;
      newState.byId[id].time              = 0;
      break;

    case constantsActions.GAME_COMPLETE:      // конец игры, между играми делать ничего нельзя, TODO - это имеются в виду BOARD controls. Переосмыслить. Вероятно надо делать ч/б затененную доску
      var id = newState.allIds[newState.allIds.length-1];
      newState.byId[id].status  = gameConstants.gameState.STATE_COMPLETED;
      newState.byId[id].result  = action.result;
      newState.byId[id].time    = undefined; 
      break;
    
    case constantsActions.WEAK_RECORD:
      var id = newState.allIds[newState.allIds.length-1];
      newState.byId[id].index = 5;
      break;

    case constantsActions.NEW_RECORD:
      var id = newState.allIds[newState.allIds.length-1];
      newState.byId[id].index = action.index;
      break;

    default:
      newState = state;
  }

  // if (newState.allIds && newState.allIds.length) {
  //   console.log(`стейтовое время после обработки action ${action.type} равно ${newState.byId[newState.allIds[newState.allIds.length-1]].time}`);
  // }

  return newState;
};
