import { combineReducers }  from 'redux'  ;

import   fx     from 'reducers/fx'    ;
import   game   from 'reducers/game'  ;
import   popup  from 'reducers/popup' ;
import   stats  from 'reducers/stats' ;
import   turn   from 'reducers/turn'  ;

export default combineReducers({
  fx    ,
  game  ,
  popup ,
  stats ,
  turn
});
