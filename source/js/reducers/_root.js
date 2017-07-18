import { combineReducers }  from 'redux'            ;

import   board              from 'reducers/board'   ;
import   fx                 from 'reducers/fx'      ;
import   game               from 'reducers/game'    ;
import   popup              from 'reducers/popup'   ;
import   stats              from 'reducers/stats'   ;

export default combineReducers({
  board     ,
  fx        ,
  game      ,
  popup     ,
  stats
});