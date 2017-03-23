import { combineReducers } from 'redux';

import board    from './board'    ;
import fx       from './fx'       ;
import game     from './game'     ;
import menu     from './menu'     ;
import popup    from './popup'    ;
import stats    from './stats'    ;

export default combineReducers({
  board     ,
  fx        ,
  game      ,
  menu      ,
  popup     ,
  stats
});