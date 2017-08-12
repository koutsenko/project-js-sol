import   thunk              from 'redux-thunk'                ;
import { applyMiddleware }  from 'redux'                      ;

import   animations         from 'middlewares/animations'     ;
import   game               from 'middlewares/game'           ;
import   logger             from 'middlewares/logger'         ;
import   storage            from 'middlewares/storage'        ;
import   timer              from 'middlewares/timer'          ;

export default applyMiddleware(
  thunk       , // Первый, чтобы воспринимать thunk вместо объектов
  logger      , // Второй, чтобы вывести действия до останова по ошибке
  animations  ,
  storage     ,
  timer       ,
  game        ,
);
