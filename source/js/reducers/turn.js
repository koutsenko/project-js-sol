import { combineReducers }  from 'redux'  ;

import   flipped  from 'reducers/turn/flipped'  ;
import   holders  from 'reducers/turn/holders'  ;
import   index    from 'reducers/turn/index'    ;
import   previous from 'reducers/turn/previous' ;

export default combineReducers({
  flipped   ,
  holders   ,
  index     ,
  previous  ,
});
