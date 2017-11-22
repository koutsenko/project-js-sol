import { createSelector }     from 'reselect'         ;

import   createCachedSelector from 're-reselect'      ;

import   constantsApp         from 'constants/app'    ;
import   constantsBoard       from 'constants/board'  ;
import   selectorsTurn        from 'selectors/turn'   ;

/**
 * Функции-хелперы.
 * Возможно, не обязательны, так как 'px' и так добавляется по-умолчанию.
 * Но - явное лучше неявного.
 */
const normalize = function(value) {
  return value !== null ? (Math.round(value) + 'px') : value;
}
const denormalize = function(value) {
  return value !== null ? (parseInt(value.substr(0, value.length-2))) : value;
}

/**
 * Простые input-селекторы
 */
const getW    = (layoutState) => layoutState.size.w;
const getH    = (layoutState) => layoutState.size.h;
const getMini = (layoutState) => layoutState.mini;

/**
 * Сложный, но вспомогательный input-селектор
 */
const getMode = createSelector(
  getW,
  getH,
  function(w, h) {
    let mode, AR = w/h;

    if (AR < 3/4) {
      mode = constantsApp.MODES.NARROW;
    } else if (AR > 175/128) {
      mode = constantsApp.MODES.WIDE;
    } else {
      mode = constantsApp.MODES.NORMAL;
    }

    return mode;
  }
);

/**
 * Простенький селектор для размера шрифта
 */
const appStyle = createSelector(
  getW,
  getH,
  getMode,
  function(w, h, mode) {
    return {
      fontSize: normalize({
        [constantsApp.MODES.NARROW  ]: 2.5*w/100,
        [constantsApp.MODES.NORMAL  ]: 2.5*w/100,
        [constantsApp.MODES.WIDE    ]: 3*h/100
      }[mode])
    };
  }
);

/**
 * Непосредственно сами селекторы с параметрами
 */
const holderStyle = createCachedSelector(
  (holderId) => holderId,
  (holderId, layoutState) => getW(layoutState),
  (holderId, layoutState) => getH(layoutState),
  (holderId, layoutState) => getMode(layoutState),
  (holderId, w, h, mode) => getHolderStyle(w, h, mode, holderId)
)(
  (holderId) => holderId
);

/**
 * FIXME getHolderFlips: мониторится state, и все равно будет пересчет
 * даже если state.turn не изменился..
 */
const cardStyle = createCachedSelector(
  (cardId) => cardId,
  (cardId, turnState, layoutState) => getW(layoutState),
  (cardId, turnState, layoutState) => getH(layoutState),
  (cardId, turnState, layoutState) => getMode(layoutState),
  (cardId, turnState, layoutState) => getMini(layoutState),
  (cardId, turnState) => selectorsTurn.getHolderFlips(turnState, cardId),
  (cardId, turnState) => selectorsTurn.getCardIndex(turnState, cardId),
  (cardId, turnState) => selectorsTurn.getHolderId(turnState, cardId),
  (cardId, turnState) => selectorsTurn.getNeighbours(turnState, cardId),
  (cardId, turnState, layoutState, shifted) => shifted,
  (cardId, turnState, layoutState, shifted, deltas) => deltas,
  (cardId, turnState, layoutState, shifted, deltas, animated) => animated,
  (id, w, h, mode, mini, flips, index, holderId, holder, shifted, deltas, animated) => getCardStyle(id, w, h, mode, mini, index, flips, holderId, holder, shifted, deltas, animated)
)(
  (cardId) => cardId,
  /*{
    selectorCreator: createDeepEqualSelector
  }*/
);

const menuStyle = createCachedSelector(
  (btnCount, layoutState) => getW(layoutState),
  (btnCount, layoutState) => getH(layoutState),
  (btnCount, layoutState) => getMode(layoutState),
  (btnCount) => btnCount,
  (w, h, mode, btnCount) => getMenuStyle(w, h, mode, btnCount)
)(
  (btnCount) => btnCount
);

const menuButtonStyle = createCachedSelector(
  getW,
  getH,
  getMode,
  (layoutState, btnCount) => btnCount,
  (layoutState, btnCount, btnIndex) => btnIndex,
  (w, h, mode, btnCount, btnIndex) => getMenuButtonStyle(w, h, mode, btnCount, btnIndex)
)(
  (layoutState, btnCount, btnIndex) => btnCount + ':' + btnIndex
);

/**
 * "Тяжелые вычисления"
 */
const getStackCardShift = function(id, index, height, holderId, holder, flips, mini) {
  if (!constantsBoard.isStackPlace(holderId)) {
    return 0;
  }

  // если карта закрытая или первая открытая, тупо возвращаем как раньше
  if (!(flips.indexOf(id)+1) || index === 0) {
    return (height/5) * index;
  }

  // иначе если вторая, третья и так далее из всех открытых карт
  // console.log('подсчет для карты ' , cards[index]);
  let flippedCount = flips.length;
  let nonFlippedCount = holder.length - flippedCount;
  // console.log('для холдера ' + holderId + ' кол-во открытых карт равно ' + flippedCount + ', а кол-во закрытых = ' + nonFlippedCount);

  let base = (height/5) * nonFlippedCount;
  // console.log('базовый сдвиг', base);

  let openedIndex = index - nonFlippedCount;
  // console.log('индекс среди сдвинутых открытых карт: ', openedIndex);

  let delta = (height/(mini ? 1.5 : 3)) * openedIndex;
  // console.log('значение нарощенной дельты ' + delta);

  return base + delta;
}

const getHolderStyle = function(w, h, mode, holderId, innerCall) {
  if (!innerCall) {
    console.log(`holder ${holderId}: selector was forced to recalculate style`);
  }
  let holderLeft    ;
  let holderTop     ;

  let holderIndex   ;
  let holderMargin  ;
  let holderWidth   ;
  let holderHeight  ;

  let rowIndex;

  let holderCoors = {
    [constantsBoard.places.DECK]  : [0, 0],
    [constantsBoard.places.OPEN]  : [1, 0],
    'status'                      : [2, 0],
    [constantsBoard.places.HOME1] : [3, 0],
    [constantsBoard.places.HOME2] : [4, 0],
    [constantsBoard.places.HOME3] : [5, 0],
    [constantsBoard.places.HOME4] : [6, 0],
    [constantsBoard.places.STACK1]: [0, 1],
    [constantsBoard.places.STACK2]: [1, 1],
    [constantsBoard.places.STACK3]: [2, 1],
    [constantsBoard.places.STACK4]: [3, 1],
    [constantsBoard.places.STACK5]: [4, 1],
    [constantsBoard.places.STACK6]: [5, 1],
    [constantsBoard.places.STACK7]: [6, 1]
  }[holderId];

  if (mode === constantsApp.MODES.NARROW) {
    holderWidth = 80*w/100/7;
    holderHeight = 6*holderWidth/5;
    holderMargin = holderWidth/8;
  } else if (mode === constantsApp.MODES.NORMAL) {
    holderWidth = 80*w/100/7;
    holderHeight = 6*holderWidth/5;
    holderMargin = holderWidth/8;
  } else if (mode === constantsApp.MODES.WIDE) {
    holderWidth = 875*h/100/64;
    holderHeight = 525*h/100/32;
    let boardWidth = w - h/100*(875/64 + 2*875/512);
    holderMargin = (boardWidth - 7*holderWidth)/14;

    let rowWidth  = w - h/100*(875/64 + 2*875/512);
    let rowMaxW   = 14*(875*h/100/64);
    if (rowWidth > rowMaxW) {
      holderMargin = (rowMaxW - 7*holderWidth)/14;
    }
  }

  holderLeft = holderMargin + holderCoors[0]*(holderWidth + 2*holderMargin);
  holderTop = holderCoors[1] ? ((1+1/2)*holderHeight) : holderHeight/6;

  return {
    height  : normalize(holderHeight),
    left    : normalize(holderLeft),
    top     : normalize(holderTop),
    width   : normalize(holderWidth)
  };
};

const getCardStyle = function(id, w, h, mode, mini, index, flips, holderId, holder, shifted, deltas, animated) {
  console.log(`card ${id}: selector was forced to recalculate style`);

  let cardHeight      ;
  let cardWidth       ;
  let cardTransform   ;

  let x = 0;
  let y = 0;

  if (mode === constantsApp.MODES.NARROW) {
    cardWidth = 80*w/100/7;
    cardHeight = 6*cardWidth/5;

  } else if (mode === constantsApp.MODES.NORMAL) {
    cardWidth = 80*w/100/7;
    cardHeight = 6*cardWidth/5;

  } else if (mode === constantsApp.MODES.WIDE) {
    cardWidth = 875*h/100/64;
    cardHeight = 525*h/100/32;
  }

  if (shifted) {
    x        += shifted[0],
    y        += shifted[1]
  }
  x += cardWidth*deltas.x/100;
  y += cardHeight*deltas.y/100;

  let ownerHolderStyle = getHolderStyle(w, h, mode, holderId, true);

  x +=  denormalize(ownerHolderStyle.left);
  y +=  denormalize(ownerHolderStyle.top);

  y += getStackCardShift(id, index, cardHeight, holderId, holder, flips, mini);

  cardTransform = `translate(${x}px,${y}px) rotate(${deltas.r}deg)`;

  return {
    height          : cardHeight,
    transform       : cardTransform,
    webkitTransform : cardTransform,
    width           : cardWidth,
    zIndex          : index + 10 + ((shifted || animated) ? 100 : 0),
  };
};

const getMenuStyle = function(w, h, mode, btnCount) {
  console.log(`menu: selector was forced to recalculate card style`);
  let fontSize    ;
  let menuWidth   ; // вычисляется первым... поэтому для красоты не по алфавиту
  let menuBottom  ;
  let menuHeight  ;
  let menuLeft    ;
  let menuRight   ;
  let menuTop     ;

  if (mode === constantsApp.MODES.NARROW) {
    fontSize    = 7/btnCount/1.25 + 'em';
    menuWidth   = w;                            // вся ширина контейнера
    menuBottom  = 0;
    menuHeight  = h/btnCount;                   // кнопки квадратные и равномерные - просто делим ширину на кол-во кнопок и получаем высоту
    menuLeft    = 0;
    menuRight   = null;
    menuTop     = null;
  } else if (mode === constantsApp.MODES.NORMAL) {
    fontSize    = '0.8em';
    menuWidth   = w / 7 * btnCount;             // кнопки шириной с карту - делим ширину на 7 стеков и умножаем на кол-во кнопок
    menuBottom  = 0;
    menuHeight  = w / 7;                        // высота меню = ширине карты (ессно с маргинами)
    menuLeft    = (w - menuWidth)/2;
    menuRight   = null;
    menuTop     = null;
  } else if (mode === constantsApp.MODES.WIDE) {
    fontSize    = '0.8em';
    menuWidth   = (5/4) * (875/64) * h/100;     // хитрые расчеты... TODO упростить или обосновать
    menuBottom  = null;
    menuHeight  = w;
    menuLeft    = null;
    menuRight   = 0;
    menuTop     = 0;
  }

  return {
    bottom    : normalize(menuBottom),
    fontSize  : fontSize,
    height    : normalize(menuHeight),
    left      : normalize(menuLeft),
    position  : 'absolute',
    right     : normalize(menuRight),
    top       : normalize(menuTop),
    width     : normalize(menuWidth)
  };
};

const getMenuButtonStyle = function(w, h, mode, btnCount, btnIndex) {
  console.log(`menu button index ${btnIndex}: selector was forced to recalculate style`);
  let menuButtonSide    ;
  let menuButtonMargin  ;
  let menuButtonLeft    ;
  let menuButtonRight   ;
  let menuButtonBottom  ;
  let menuButtonTop     ;

  if (mode === constantsApp.MODES.NARROW) {
    menuButtonSide    = Math.floor(80 * w/100 / btnCount);              // кнопки квадратные и равномерные - просто делим ширину на кол-во кнопок и получаем высоту
    menuButtonMargin  = Math.floor(menuButtonSide/8);
    menuButtonLeft    = menuButtonMargin*(2*btnIndex+1) + btnIndex*menuButtonSide;
    menuButtonRight   = null;
    menuButtonBottom  = menuButtonMargin;
    menuButtonTop     = null;
  } else if (mode === constantsApp.MODES.NORMAL) {
    menuButtonSide    = Math.floor(80 * w/100 / 7);
    menuButtonMargin  = Math.floor(menuButtonSide/8);
    menuButtonLeft    = menuButtonMargin*(2*btnIndex+1) + btnIndex*menuButtonSide;
    menuButtonRight   = null;
    menuButtonBottom  = menuButtonMargin;
    menuButtonTop     = null;
  } else if (mode === constantsApp.MODES.WIDE) {
    menuButtonSide    = Math.floor(875/64*h/100);
    menuButtonMargin  = Math.floor(menuButtonSide/8);
    menuButtonLeft    = null;
    menuButtonRight   = menuButtonMargin;
    menuButtonBottom  = null;
    menuButtonTop     = menuButtonMargin*(2*btnIndex+1) + btnIndex*menuButtonSide;
  }

  return {
    bottom    : normalize(menuButtonBottom),
    height    : normalize(menuButtonSide),
    left      : normalize(menuButtonLeft),
    position  : 'absolute',
    right     : normalize(menuButtonRight),
    top       : normalize(menuButtonTop),
    width     : normalize(menuButtonSide)
  };
};

export default {
  appStyle        ,
  cardStyle       ,
  holderStyle     ,
  menuStyle       ,
  menuButtonStyle ,
};