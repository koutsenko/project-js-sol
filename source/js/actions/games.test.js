import configureMockStore   from 'redux-mock-store'   ;
import thunk                from 'redux-thunk'        ;
import { createStore }      from 'redux'              ;

import { getRandomInt }     from '../tools/math'      ;

import gameActions          from '../actions/games'   ;

import rootReducer          from '../reducers/_root'  ;
import { buildDeck }        from '../reducers/board'  ;
import { loadBoard }        from '../reducers/board'  ;

import rootMiddleware       from '../middlewares/_root';

let generateAlmostWinnedSave = function(c, deckCount, openCount, homeCount, stackCount) {
  let cards = c.slice();
  let ranks = ['K', 'Q', 'J', '=', '9', '8', '7', '6', '5', '4', '3', '2', 'A'];
  let suits = ['H', 'S', 'C', 'D'];

  let stacks  = [
    [],
    [],
    [],
    [],
    [],
    [],
    []
  ];
  let homes   = [
    [],
    [],
    [],
    []
  ];
  let deck    = [];
  let open    = [];
  let opened  = [];

  // заполняем homes
  let workingHomes = [0, 1, 2, 3];
  // console.log(`Вбрасываем в homes ${homeCount} карт`);
  for (var i = 0; i < homeCount; i++) {
    // выбираем в какой home вкидываем карту
    let index = workingHomes[getRandomInt(0, workingHomes.length)];
    let home = homes[index];
    let card;
    if (home.length === 0) {                    // в этом доме еще нет карт, занимаем свободную масть  
      let s = ['S', 'C', 'D', 'H'];             // список мастей среди которых ищем свободные
      for (var j = 0; j < 4; j++) {             // перебираем дома
        let h = homes[j];                       // текущий дом
        if (h.length) {                         // если в нем что-то есть
          let sh = h[0][1];                     // считываем масть с первой же его карты
          s.splice(s.indexOf(sh), 1);           // и удаляем из списка!
        }
      }
      card = 'A'+s[0];
    } else {      
      let last = home[home.length-1];           // дом непустой, теперь надо вытащить из колоды карту младше той же масти
      card = ranks[ranks.indexOf(last[0])-1]+last[1];
    }
    // с картой определились
    home.push(card);
    cards.splice(cards.indexOf(card), 1);
    if (card[0] === 'K') {              // больше этот дом не участвует
      workingHomes.splice(workingHomes.indexOf(index), 1);
    }
  }
  let length = 0;
  homes.forEach(function(home) {
    length += home.length;
  });

  // console.log(`По факту вбросили в homes ${length} карт`);
  // console.log(homes);
  // console.log(`Осталось рабочих карт в колоде: ${cards.length}`);

  // заполняем stacks
  let workingStacks = [0, 1, 2, 3, 4, 5, 6];
  // console.log(`Вбрасываем в stacks ${stackCount} карт`);
  for (var i = 0; i < stackCount; i++) {
    // выбираем в какой stack вбрасываем карту
    let index = workingStacks[getRandomInt(0, workingStacks.length)];
    let stack = stacks[index];
    let last = stack[stack.length-1];
    let card;
    if (last === undefined) {
      // если стек пустой и есть свободные короли - закидываем его
      for (var k = 0; k < suits.length; k++) {
        let c = 'K'+suits[k]; 
        if (cards.indexOf(c) > -1) {          
          card = c;
          break;
        }
      }
    } else {
      // иначе карту ниже достоинством и другого цвета
      let bSuits  = ['S', 'C'];
      let rSuits  = ['H', 'D'];
      let tSuits = (bSuits.indexOf(last[1]) > -1) ? rSuits : bSuits;
      let rank = ranks[ranks.indexOf(last[0])+1];
      // возможны два варианта такой карты, берем из колоды первый доступный
      let card1 = rank+tSuits[0];
      let card2 = rank+tSuits[1];
      if (cards.indexOf(card1) > -1) {
        card = card1;
      } else if (cards.indexOf(card2) > -1) {
        card = card2;
      }
    }
    // может случиться что для этого стека уже не осталось королей.
    if (card !== undefined) {
      stack.push(card);
      cards.splice(cards.indexOf(card), 1);
      // если вбросили двойку - то потом убираем индекс этого стека из workingStacks
      if (card[0] === '2') {
        workingStacks.splice(workingStacks.indexOf(index), 1);
      }
    } else {
      i--;
      workingStacks.splice(workingStacks.indexOf(index), 1);
    }
  }

  length = 0;
  stacks.forEach(function(stack) {
    length += stack.length;
  });

  // console.log(`По факту вбросили в stacks ${length} карт`);
  // console.log(stacks);
  // console.log(`Осталось рабочих карт в колоде: ${cards.length}`);

  // заполняем open
  // console.log(`Вбрасываем в open ${openCount} карт`);
  open = cards.splice(0, openCount);
  // console.log(`По факту вбросили в open ${open.length} карт`);
  // console.log(`Осталось рабочих карт в колоде: ${cards.length}`);

  // заполняем deck
  // console.log(`Вбрасываем в deck ${deckCount} карт`);
  deck = cards.splice(0, deckCount);
  // console.log(`По факту вбросили в deck ${deck.length} карт`);
  // console.log(`Осталось рабочих карт в колоде: ${cards.length}`);

  // заполняем opened
  opened = c.slice();
  deck.forEach(function(card) {
    opened.splice(opened.indexOf(card), 1);
  });
  // console.log(`Открытые карты по сути все кроме deck, их кол-во: ${opened.length}`);

  return {
    board   : {
      stacks  : stacks,
      homes   : homes,
      deck    : deck,
      open    : open,
      index   : 0     // хардкод.
    },
    time    : 0,      // хардкод.
    opened  : opened  // все кроме тех кто в deck
  };
}

test('hello world', function() {
  let cards       = buildDeck();
  let length      = cards.length;
  let homeCount   = getRandomInt(0, length-1);
  let stackCount  = getRandomInt(0, length-homeCount);
  let openCount   = getRandomInt(0, length-stackCount-homeCount);
  let deckCount   = length-openCount-stackCount-homeCount;
  // FIXME переделать чтобы в loadBoard проекта передавался уже раскрытый data
  let data = encodeURI(JSON.stringify(generateAlmostWinnedSave(
    cards,
    deckCount,
    openCount,
    homeCount,
    stackCount
  )));
  // console.log('52=' + homeCount + '+' + stackCount + '+' + openCount + '+' + deckCount);

  const store = createStore(rootReducer, rootMiddleware);
  console.log(data);
  store.dispatch(gameActions.load(data));
  store.dispatch(gameActions.completeGame());
  console.log(data);
  expect(store.getState().game.completed).toBe(true);
});