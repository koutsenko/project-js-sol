import   thunk              from 'redux-thunk'                ;
import { applyMiddleware }  from 'redux'                      ;

import   animations         from 'middlewares/animations'     ;
import   cardDOMTest        from 'middlewares/tests/cardDOM'  ;
import   game               from 'middlewares/game'           ;
import   logger             from 'middlewares/logger'         ;
import   storage            from 'middlewares/storage'        ;
import   timer              from 'middlewares/timer'          ;

export default applyMiddleware(
  thunk       , // Первый, чтобы воспринимать thunk вместо объектов
  logger      , // Второй, чтобы вывести действия до останова по ошибке
  cardDOMTest , // Третий, тестирует что DOM-позиции карт совпадют с объектными
  animations  ,
  storage     ,
  timer       ,
  game        ,
);
