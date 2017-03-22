import { places } from '../../constants/app';

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

  lastError = lastError || testDOM(places.DECK, '#app .deck', cardSelector, state.board.deck, state.board.cards, undefined);
  lastError = lastError || testDOM(places.OPEN, '#app .open', cardSelector, state.board.open, state.board.cards, undefined);
  for (var i = 0; i < 4; i++) {
    lastError = lastError || testDOM(places.HOME, '#app .home'+i, cardSelector, state.board.homes[i], state.board.cards, i);
  }
  for (var i = 0; i < 7; i++) {
    lastError = lastError || testDOM(places.STACK, '#app .stack'+i, cardSelector, state.board.stacks[i], state.board.cards, i);
  }

  if (lastError) {
    console.log('state changed and game board integrity test failed: ', lastError);
  }
};

const testDOM = function(placeType, holderSelector, cardSelector, holderRef, cardsRef, ownerIndex) {
  let lastError;

  let holderEl = document.body.querySelector(holderSelector);
  let cardEls = holderEl.querySelectorAll(cardSelector);

  cardEls.forEach(function(cardEl, index) {
    let domClassValue = cardEl.classList[1];

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


