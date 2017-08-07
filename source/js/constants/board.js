const highlights = {
  ACCEPT  : 'ACCEPT'  ,
  DENY    : 'DENY'
};

const places = {
  DECK    : 'DECK'    ,
  OPEN    : 'OPEN'    ,
  HOME1   : 'HOME1'   ,
  HOME2   : 'HOME2'   ,
  HOME3   : 'HOME3'   ,
  HOME4   : 'HOME4'   ,
  STACK1  : 'STACK1'  ,
  STACK2  : 'STACK2'  ,
  STACK3  : 'STACK3'  ,
  STACK4  : 'STACK4'  ,
  STACK5  : 'STACK5'  ,
  STACK6  : 'STACK6'  ,
  STACK7  : 'STACK7'
};

const isStackPlace = function(place) {
  return ['STACK1', 'STACK2', 'STACK3', 'STACK4', 'STACK5', 'STACK6', 'STACK7'].indexOf(place) !== -1;
};

const isHomePlace = function(place) {
  return ['HOME1', 'HOME2', 'HOME3', 'HOME4'].indexOf(place) !== -1; 
}

const getHomePlaces = function() {
  return [
    places.HOME1,
    places.HOME2,
    places.HOME3,
    places.HOME4
  ];
};

const getStackPlaces = function() {
  return [
    places.STACK1,
    places.STACK2,
    places.STACK3,
    places.STACK4,
    places.STACK5,
    places.STACK6,
    places.STACK7
  ];
};

const mapClassToPlace = {
  'd'  : places.DECK    ,
  'o'  : places.OPEN    ,
  's1' : places.STACK1  ,
  's2' : places.STACK2  ,
  's3' : places.STACK3  ,
  's4' : places.STACK4  ,
  's5' : places.STACK5  ,
  's6' : places.STACK6  ,
  's7' : places.STACK7  ,
  'h1' : places.HOME1   ,
  'h2' : places.HOME2   ,
  'h3' : places.HOME3   ,
  'h4' : places.HOME4
};

const mapPlaceToClass = {
  [ places.DECK   ] : 'd',
  [ places.OPEN   ] : 'o',
  [ places.STACK1 ] : 's1',
  [ places.STACK2 ] : 's2',
  [ places.STACK3 ] : 's3',
  [ places.STACK4 ] : 's4',
  [ places.STACK5 ] : 's5',
  [ places.STACK6 ] : 's6',
  [ places.STACK7 ] : 's7',
  [ places.HOME1  ] : 'h1',
  [ places.HOME2  ] : 'h2',
  [ places.HOME3  ] : 'h3',
  [ places.HOME4  ] : 'h4'
};

const suits = ['H', 'D', 'C', 'S'];
const ranks = ['A', 'K', 'Q', 'J', '=', '9', '8', '7', '6', '5', '4', '3', '2'];

const ranksL2H = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '=', 'J', 'Q', 'K'];

export default { highlights, places, suits, ranks, isStackPlace, isHomePlace, getHomePlaces, getStackPlaces, mapClassToPlace, mapPlaceToClass, ranksL2H };