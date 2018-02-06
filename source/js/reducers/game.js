/* eslint-disable no-var */
import tsRandom         from 'uuid/v1'            ;

import constantsActions from 'constants/actions'  ;
import gameConstants    from 'constants/game'     ;
import toolsTime        from 'tools/time'         ;

export default function(state, action) {
  if (state === undefined) {
    state = {
      allIds  : [],
      byId    : {}
    };
  }

  var newState = JSON.parse(JSON.stringify(state));
  var id;

  switch (action.type) {
    case constantsActions.GAME_CREATED:
      id = tsRandom();
      newState.allIds.push(id);
      newState.byId[id] = {
        id                : id,
        index             : undefined,  // Выигранная сейчас игра - место в таблице рекордов, 0-4 для рекорда, 5 для нерекорда
        result            : undefined,  // Выигранная сейчас игра - результат
        controlsEnabled   : false,
        time              : undefined,
        seed              : action.seed,
        status            : gameConstants.gameState.GAME_CREATED
      };
      break;

    case constantsActions.GAME_END:
      id = newState.allIds[newState.allIds.length-1];
      newState.byId[id] = {
        time              : undefined
      };
      break;

    case constantsActions.LOAD_SCENARIO: // сигнал о загрузке сохраненки, он пока что обходится без анимации и поэтому controlsEnabled = true. TODO - переосмыслить...
      var data = JSON.parse(decodeURI(action.data));
      id = tsRandom();
      newState.allIds.push(id);
      newState.byId[id] = {
        id                : id,
        index             : undefined,  // Выигранная сейчас игра - место в таблице рекордов, 0-4 для рекорда, 5 для нерекорда
        result            : undefined,  // Выигранная сейчас игра - результат
        controlsEnabled   : true,
        time              : toolsTime.calculateUnixTimeBefore(action.currentTime, data.time),
        seed              : data.seed,
        status            : gameConstants.gameState.STATE_STARTED
      };
      break;

    case constantsActions.GAME_START:    // сигнал об окончании раздачи и старте игры
      id = newState.allIds[newState.allIds.length-1];
      newState.byId[id].status            = gameConstants.gameState.STATE_STARTED;
      newState.byId[id].controlsEnabled   = true;
      newState.byId[id].time              = action.time;  // FIXME текущее unix время, у нас возможно будут проблемы с загрузкой сохраненок...
      break;

    case constantsActions.GAME_COMPLETE:      // конец игры, между играми делать ничего нельзя, TODO - это имеются в виду BOARD controls. Переосмыслить. Вероятно надо делать ч/б затененную доску
      id = newState.allIds[newState.allIds.length-1];
      newState.byId[id].status  = gameConstants.gameState.STATE_COMPLETED;
      newState.byId[id].result  = action.result;
      newState.byId[id].time    = undefined;
      break;

    case constantsActions.WEAK_RECORD:
      id = newState.allIds[newState.allIds.length-1];
      newState.byId[id].index = 5;
      break;

    case constantsActions.NEW_RECORD:
      id = newState.allIds[newState.allIds.length-1];
      newState.byId[id].index = action.index;
      break;

    default:
      newState = state;
  }

  // if (newState.allIds && newState.allIds.length) {
  //   console.log(`стейтовое время после обработки action ${action.type} равно ${newState.byId[newState.allIds[newState.allIds.length-1]].time}`);
  // }

  return newState;
}
