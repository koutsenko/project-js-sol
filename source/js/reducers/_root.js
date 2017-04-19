import { combineReducers } from 'redux';

import access   from './access'   ;
import board    from './board'    ;
import fx       from './fx'       ;
import game     from './game'     ;
import popup    from './popup'    ;
import stats    from './stats'    ;

export default combineReducers({
  access    ,
  board     ,
  fx        ,
  game      ,
  popup     ,
  stats
});