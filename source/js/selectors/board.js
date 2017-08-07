import { createSelector } from 'reselect'           ;

import   constantsBoard   from '../constants/board' ;

const getCards = (state) => state.board.cards.byId;

const getDeckCardIds    = (state) => state.board.holders.byId[constantsBoard.places.DECK]   ;
const getOpenCardIds    = (state) => state.board.holders.byId[constantsBoard.places.OPEN]   ;
const getStack1CardIds  = (state) => state.board.holders.byId[constantsBoard.places.STACK1] ;
const getStack2CardIds  = (state) => state.board.holders.byId[constantsBoard.places.STACK2] ;
const getStack3CardIds  = (state) => state.board.holders.byId[constantsBoard.places.STACK3] ;
const getStack4CardIds  = (state) => state.board.holders.byId[constantsBoard.places.STACK4] ;
const getStack5CardIds  = (state) => state.board.holders.byId[constantsBoard.places.STACK5] ;
const getStack6CardIds  = (state) => state.board.holders.byId[constantsBoard.places.STACK6] ;
const getStack7CardIds  = (state) => state.board.holders.byId[constantsBoard.places.STACK7] ;
const getHome1CardIds   = (state) => state.board.holders.byId[constantsBoard.places.HOME1]  ;
const getHome2CardIds   = (state) => state.board.holders.byId[constantsBoard.places.HOME2]  ;
const getHome3CardIds   = (state) => state.board.holders.byId[constantsBoard.places.HOME3]  ;
const getHome4CardIds   = (state) => state.board.holders.byId[constantsBoard.places.HOME4]  ;

const resultFunc = (ids, cards) => ids.map((id) => cards[id]);

export default {
  getDeckCards    : createSelector([getDeckCardIds  , getCards] , resultFunc),
  getOpenCards    : createSelector([getOpenCardIds  , getCards] , resultFunc),
  getStack1Cards  : createSelector([getStack1CardIds, getCards] , resultFunc), 
  getStack2Cards  : createSelector([getStack2CardIds, getCards] , resultFunc),
  getStack3Cards  : createSelector([getStack3CardIds, getCards] , resultFunc),
  getStack4Cards  : createSelector([getStack4CardIds, getCards] , resultFunc), 
  getStack5Cards  : createSelector([getStack5CardIds, getCards] , resultFunc),
  getStack6Cards  : createSelector([getStack6CardIds, getCards] , resultFunc),
  getStack7Cards  : createSelector([getStack7CardIds, getCards] , resultFunc), 
  getHome1Cards   : createSelector([getHome1CardIds , getCards] , resultFunc), 
  getHome2Cards   : createSelector([getHome2CardIds , getCards] , resultFunc),
  getHome3Cards   : createSelector([getHome3CardIds , getCards] , resultFunc),
  getHome4Cards   : createSelector([getHome4CardIds , getCards] , resultFunc)
};