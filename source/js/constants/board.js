import toolsArray  from 'tools/array';

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

const isCard = function(id) {
  return (id.length === 2) && (ranks.indexOf(id[0])+1) && (suits.indexOf(id[1])+1);
};

const isStackPlace = function(place) {
  return ['STACK1', 'STACK2', 'STACK3', 'STACK4', 'STACK5', 'STACK6', 'STACK7'].indexOf(place) !== -1;
};

const isHomePlace = function(place) {
  return ['HOME1', 'HOME2', 'HOME3', 'HOME4'].indexOf(place) !== -1;
}

const getHomePlace = function(index) {
  return places['HOME' + (index+1)];
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

const suits = ['H', 'D', 'C', 'S'];
const ranks = ['A', 'K', 'Q', 'J', '=', '9', '8', '7', '6', '5', '4', '3', '2'];

const cards = toolsArray.flatten(ranks.map(function(rank) {
  return suits.map(function(suit) {
    return rank+suit;
  });
}));

const ranksL2H = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '=', 'J', 'Q', 'K'];

export default { cards, getHomePlace, isCard, highlights, places, suits, ranks, isStackPlace, isHomePlace, getHomePlaces, getStackPlaces, ranksL2H };
