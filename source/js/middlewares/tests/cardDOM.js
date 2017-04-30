import { places } from '../../constants/app';
import { canAcceptDropToHome, canAcceptDropToStack } from '../../tools/rules';

export default function(store) {
  let getState = store.getState;

  return function(next) {
    return function(action) {
      let result = next(action);
      setTimeout(function() {
        window.requestAnimationFrame(function() {
          performTests(getState());
        }.bind(this));
      }.bind(this), 0);
      return result;
    };
  };
};

const performTests = function(state) {
  let lastError;

  // let cardSelector = '.card:not(.hidden)';
  let cardSelector = '.card';

  lastError = lastError || testCards(state.board.cards);

  lastError = lastError || testDOM(places.DECK, '#app .deck', 0, cardSelector, state.board.deck, state.board.cards, undefined);
  lastError = lastError || testDOM(places.OPEN, '#app .open', 0, cardSelector, state.board.open, state.board.cards, undefined);
  lastError = lastError || testOpenCards(state.board.open, state.board.cards);
  for (var i = 0; i < 4; i++) {
    lastError = lastError || testDOM(places.HOME, '#app .home', i, cardSelector, state.board.homes[i], state.board.cards, i);
    lastError = lastError || testHomeCards(state.board.homes[i], state.board.cards);
  }
  for (var i = 0; i < 7; i++) {
    lastError = lastError || testDOM(places.STACK, '#app .stack', i, cardSelector, state.board.stacks[i], state.board.cards, i);
    lastError = lastError || testStackOpenedCards(state.board.stacks[i], state.board.cards);
  }

  if (lastError) {
    console.log('Новое состояние ошибочное! Последняя из ошибок: ', lastError);
  }
};

const testCards = function(cards) {
  let lastError;

  let ids = Object.keys(cards);
  let length = ids.length;
  if (length !== 52) {
    let suits = ['S', 'C', 'H', 'D'];
    let ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '=', 'J', 'Q', 'K'];
    let missing = [];
    // TODO добавить так же вывод лишних карт
    suits.forEach(function(suit) {
      ranks.forEach(function(rank) {
        let card = rank+suit;
        if (Object.keys(cards).indexOf(card) < 0) {
          missing.push(card);
        }
      });
    });
    lastError = 'Неверное кол-во на столе, должно быть 52, а по факту ' + length + ', отсутствующие карты: ' + missing.toString();
  }


  return lastError;
};

const testDOM = function(placeType, holderSelector, holderIndex, cardSelector, holderRef, cardsRef, ownerIndex) {
  let lastError;

  let holderEl = document.body.querySelectorAll(holderSelector)[holderIndex];

  let cardEls = holderEl.querySelectorAll(cardSelector);

  cardEls.forEach(function(cardEl, index) {
    // FIXME как выяснилось, удаление DOM-элементов карт вручную не ведет к ошибкам, хотя должно
    let domClassValue = cardEl.classList[1].slice(1);

    let dataPlaceType = cardsRef[domClassValue].place.owner.type;
    let dataOwnerIndex = cardsRef[domClassValue].place.owner.index;
    let dataIndexInCardData = cardsRef[domClassValue].place.index;
    let dataIndexInHolderData = holderRef.indexOf(domClassValue);

    if (dataPlaceType !== placeType) {
      lastError = 'Ошибка карты ' + domClassValue + ': в объекте карты неверный тип родителя, ожидался ' + placeType + ', получен ' + dataPlaceType;
    }

    if (dataOwnerIndex !== ownerIndex) {
      lastError = 'Ошибка карты ' + domClassValue + ': в объекте карты неверный индекс родителя, ожидался ' + ownerIndex + ', получен ' + dataOwnerIndex;
    }

    if (dataIndexInCardData !== index) {
      lastError = 'Ошибка карты ' + domClassValue + ': в объекте карты неверный индекс карты в родителе, ожидался ' + index + ', получен ' + dataIndexInCardData;
    }

    if (dataIndexInHolderData !== index) {
      lastError = 'Ошибка карты ' + domClassValue + ': в объекте родителя неверный индекс карты в родителе, ожидался ' + index + ', получен ' + dataIndexInHolderData;
    }
  });

  return lastError;
};

const testOpenCards = function(open, cards) {
  let lastError;
  open.forEach(function(id) {
    if (cards[id].flip) {
      lastError = 'В открытых появилась закрытая карта';
    }   
  });
  return lastError;
}

/**
 *
 */
const testStackOpenedCards = function(stack, cards) {
  let lastError;

  // проверим, что последняя карта стека - открытая
  if (stack.length && stack[stack.length - 1].flip) {
    lastError = 'Последняя карта стека закрытая :(';
  }

  // проверим, что нет закрытых карт после открытых
  stack.forEach(function(id, index) {
    if (index !== 0) {
      if (cards[id].flip && !cards[stack[index-1]].flip) {
        lastError = 'В стеке появилась закрытая карта после открытой';
      }
    }
  });

  // проверим, что открытые карты соответствуют правилам пасьянса-косынки (понижается старшинство, чередуется цвет, первый - король)
  stack.forEach(function(id, index) {
    let source = cards[id];
    let target = index === 0 ? undefined : cards[stack[index-1]];

    if (target !== undefined) {
      if (!source.flip && !target.flip && !canAcceptDropToStack(cards[id], target)) {
        lastError = 'В стеке есть две открытые карты не по правилам косынки (понижение старшинства и чередование цвета)';
      }
    } else {
      if (source.touched && !source.flip && !canAcceptDropToStack(cards[id])) {
        lastError = 'В стеке есть первая открытая карта не по правилам косынки (не король), при этом это не комп ее туда положил на раздаче';
      }
    }
  });

  return lastError;
};

/**
 *
 */
const testHomeCards = function(home, cards) {
  let lastError;

  // проверим что все карты дома открытые
  home.forEach(function(id) {
    if (cards[id].flip) {
      lastError = 'В доме нашлась закрытая карта...';
    }
  });

  // проверим, что карты дома соответствуют правилам пасьянса косынки (повышается старшинство, одна масть, первая - двойка)
  home.forEach(function(id, index) {
    let source = cards[id];
    let target = index === 0 ? undefined : cards[home[index-1]];

    if (!canAcceptDropToHome(source, target)) {
      lastError = 'В доме есть карта не по правилам косынки';
    };
  });

  return lastError;
};

