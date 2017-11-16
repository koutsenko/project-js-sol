import   thunk              from 'redux-thunk'                ;
import { applyMiddleware }  from 'redux'                      ;

import   animations         from 'middlewares/animations'     ;
import   core               from 'middlewares/core'           ;
import   game               from 'middlewares/game'           ;
import   logger             from 'middlewares/logger'         ;
import   storage            from 'middlewares/storage'        ;

export default applyMiddleware(
  thunk       , // Первый, чтобы воспринимать thunk вместо объектов
  logger      , // Второй, чтобы вывести действия до останова по ошибке
  core        ,
  animations  ,
  storage     ,
  game
);
