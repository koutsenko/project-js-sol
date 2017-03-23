import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';

import animations   from './animations'     ;
import cardDOMTest  from './tests/cardDOM'  ;
import game         from './game'           ;
import logger       from './logger'         ;
import storage      from './storage'        ;
import timer        from './timer'          ;

export default applyMiddleware(
  thunk       , // Первый, чтобы воспринимать thunk вместо объектов
  logger      , // Второй, чтобы вывести действия до останова по ошибке
  cardDOMTest , // Третий, тестирует что DOM-позиции карт совпадют с объектными
  animations  ,
  storage     ,
  timer       ,
  game        ,
);