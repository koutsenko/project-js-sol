var app = {
  queryEls: function() {
    for (var i = 0, els = document.body.getElementsByTagName('div'); i < els.length; i++) {
      // face это чисто оформительский элемент верстки, ссылки на них не нужны
      if (els[i].className !== 'face' && els[i].className !== '') {
          // app.el[els[i].className] = els[i];
        this.el[els[i].className.split(" ")[0]] = els[i];
      }
    }  
  },
  xhr: undefined,
  realMove: undefined,
  stopRender: undefined,
  dnd: {

  },
  data: {
    oldTarget: undefined,
    currentTarget: undefined,
    drawn: undefined,
    oldXY: undefined,
    size: undefined,
    zones: undefined,
    offset: undefined,
    card: undefined,
    cardCss: undefined,
    target: undefined,
    targetClass: '',
    stopRender: undefined,
    oldParent: undefined
  },
  el: {},
  placeCard: undefined,
  cacheDND: undefined,
  getDZ: undefined,
  getX: undefined,
  getY: undefined,
  drag: undefined,
  move: undefined,
  drop: undefined,
  canDrop: undefined,
  gameEnd: undefined
};

// FIXME определить структуру движка и чуть ниже задать функции...

function cancelEvent(event) {
    event.preventDefault();
    event.stopPropagation();
}

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
        for (var i = 0, prefixes = ['webkit', 'moz', 'o', 'ms'], name; i < prefixes.length; i++) {
            name = prefixes[i] + 'RequestAnimationFrame';
            if (typeof window[name] === 'Function') {
                return window[name];
            }
        }
        return function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    } ());
}

app.doLayout = function() {
    var unitSize, fluid, rnd = function(value) {
        return Math.round(value) + 'px';
    };

    // УНИКАЛЬНЫЕ для всех трех случаев значения
    if (window.matchMedia("(max-aspect-ratio: 17/12)").matches) {
        unitSize = document.documentElement.offsetWidth / 8.5;

        // X-координата элементов стола
        app.el['deck'].style.left = 0;
        app.el['open'].style.left = rnd(unitSize * 5 / 4);
        app.el['status'].style.left = rnd(2 * unitSize * 5 / 4);
        for (var i = 0; i < 4; i++) {
            app.el['home' + (i+1)].style.left = rnd((i+3) * unitSize * 5 / 4);
        }
        for (var i = 0; i < 7; i++) {
            app.el['stack' + (i+1)].style.left = rnd(i * unitSize * 5 / 4);
        }

        app.el['menu'].className = 'menu horizontal';
        app.el['menu'].style.right = '';
        app.el['menu'].style.height = rnd(unitSize * 5 / 4);
        app.el['menu'].style.bottom = rnd(unitSize / 4);
        app.el['menu'].style.width = '';
        app.el['menu'].style.top = '';
        app.el['buttons'].style.height = rnd(unitSize * 5 / 4);
        app.el['buttons'].style.width = rnd(unitSize * 6 * 5 / 4);
        for (var i = 0; i < 5; i++) {
            app.el['btn' + (i+1)].style.marginTop = '';
            app.el['btn' + (i+1)].style.width = rnd(unitSize * 5 / 4);
            app.el['btn' + (i+1)].style.height = rnd(unitSize * 5 / 4);
        }

        app.el['wmark'].style.bottom = rnd(2 * unitSize);
    } else {
        if (window.matchMedia("(min-aspect-ratio: 59/24)").matches) {
            //app.el['debug'].innerHTML = 'AR > 59/24';

            unitSize = document.documentElement.offsetHeight / 6,
                fluid = document.documentElement.offsetWidth / 2 - 59 * unitSize / 8;

            app.el['deck'].style.left = rnd(unitSize / 4 + fluid);
            app.el['open'].style.left = rnd(unitSize / 4 + 2 * unitSize + fluid);
            app.el['status'].style.left = rnd(unitSize / 4 + 4 * unitSize + fluid);
            for (var i = 0; i < 4; i++) {
                app.el['home' + (i+1)].style.left = rnd(unitSize / 4 + 2 * (i+3) * unitSize + fluid);
            }
            for (var i = 0; i < 7; i++) {
                app.el['stack' + (i+1)].style.left = rnd(unitSize / 4 + 2 * i * unitSize + fluid);
            }
        } else if (window.matchMedia("(min-aspect-ratio: 17/12)").matches) {
            //app.el['debug'].innerHTML = '17/12 < AR < 59/24';

            unitSize = document.documentElement.offsetHeight / 6,
                fluid = (((6 * document.documentElement.offsetWidth - 8.5 * 6* unitSize) / 42)+unitSize);
            app.el['deck'].style.left = rnd(unitSize / 4);
            app.el['open'].style.left = rnd(unitSize / 4 + fluid);
            app.el['status'].style.left = rnd(unitSize / 4 + 2*fluid);
            for (var i = 0; i < 4; i++) {
                app.el['home' + (i+1)].style.left = rnd(unitSize / 4 + (i+3)*fluid);
            }
            for (var i = 0; i < 7; i++) {
                app.el['stack' + (i+1)].style.left = rnd(unitSize / 4 + i*fluid);
            }
        }

        // В последних двух случаях общее меню
        app.el['menu'].className = 'menu vertical';
        app.el['menu'].style.height = '';
        app.el['menu'].style.width = rnd(unitSize);
        app.el['menu'].style.top = rnd(unitSize / 4);
        app.el['menu'].style.bottom = 0;
        app.el['menu'].style.right = rnd(unitSize / 4);
        app.el['buttons'].style.height = rnd(unitSize * 6);
        app.el['buttons'].style.width = 'inherit';

        app.el['wmark'].style.bottom = rnd(unitSize);

        for (var i = 0; i < 5; i++) {
            app.el['btn' + (i+1)].style.width = rnd(unitSize);
            app.el['btn' + (i+1)].style.height = rnd(unitSize);
        }
    }

    // ОБЩИЕ для всех трех случаев значения

    // ширина элементов стола
    app.el['deck'].style.width =
        app.el['open'].style.width =
            app.el['status'].style.width = rnd(unitSize);
    for (var i = 0; i < 4; i++) {
        app.el['home' + (i+1)].style.width = rnd(unitSize);
    }
    for (var i = 0; i < 7; i++) {
        app.el['stack' + (i+1)].style.width = rnd(unitSize);
    }

    // высота элементов стола
    app.el['deck'].style.height =
        app.el['open'].style.height =
            app.el['status'].style.height = rnd(6*unitSize/5);
    for (var i = 0; i < 4; i++) {
        app.el['home' + (i+1)].style.height = rnd(6*unitSize/5);
    }
    for (var i = 0; i < 7; i++) {
        app.el['stack' + (i+1)].style.height = rnd(6*unitSize/5);
    }

    // верхняя координата зон первого ряда стола
    app.el['deck'].style.top =
        app.el['open'].style.top =
            app.el['status'].style.top =
                app.el['home1'].style.top =
                    app.el['home2'].style.top =
                        app.el['home3'].style.top =
                            app.el['home4'].style.top = rnd(unitSize/4);

    // верхняя координата зон второго ряда стола
    app.el['stack1'].style.top =
        app.el['stack2'].style.top =
            app.el['stack3'].style.top =
                app.el['stack4'].style.top =
                    app.el['stack5'].style.top =
                        app.el['stack6'].style.top =
                            app.el['stack7'].style.top = rnd(unitSize*17/10); // 1/4 + 6/5 + 1/4

    document.documentElement.style.fontSize = unitSize*1.2 + '%';
}

function handlePress(el, fn, animated) {
    (function(el, fn, animated) {
        app.dnd["touchstart"] = 0;
        app.dnd["mousedown"] = 0;
        el.fn = fn;
        el.onmousedown = el.ontouchstart = function(event) {
            cancelEvent(event);
            if (app.dnd["touchstart"] > 0 && event.type === 'mousedown') {
                return;
            }
            app.dnd[event.type] += 1;

            // Анимация нажатия. 250ms вроде нормально.
            if (animated) {
                el.className += ' pressed';
                setTimeout(function() {
                    el.className = el.className.replace(' pressed', '');
                }, 250);
            }
            // 500ms is minimum recommended for Android < 4.4, because there is native delay between touchstart and mousedown...
            setTimeout(function() {
                app.dnd[event.type] = 0;
            }, 500);

            // Тяжелая функция может помешать анимации нажатия, поэтому отсрочим немного ее вызов.
            if (animated) {
                setTimeout(function() {
                    el.fn(event);
                }, 0);
            } else {
                el.fn(event);
            }
        };
    }) (el, fn, animated);
}

function handleUnpress(el, fn) {
    (function(el, fn) {
        app.dnd["mouseup"] = 0;
        app.dnd["touchend"] = 0;
        el.fn = fn;
        el.onmouseup = el.ontouchend = function(event) {
            cancelEvent(event);
            if (app.dnd["touchend"] > 0 && event.type === 'mouseup') {
                return;
            }
            app.dnd[event.type] += 1;
            if (app.dnd[event.type] < 2) {
                el.fn(event);
            }
            setTimeout(function() {
                app.dnd[event.type] = 0;
            }, 500);
        }
    }) (el, fn);
}

function getClickedCard(event) {
    var target, classes;
    for (target = event.target; target.className !== 'table'; target = target.parentNode) {
        classes = target.className.split(' ');
        if (classes[0] === 'card') {
            return classes[2] === 'flipped' ? null : target;
        }
    }
    return null;
}



app.canDrop = function(card, target) {
    var matrix,
        cardClasses,
        targetClasses,
        parent;

    if (app.data.oldParent.isEqualNode(target)) {
        return false;
    }

    cardClasses = card.className.split(' ');
    targetClasses = target.className.split(' ');

    if (target.className.indexOf('home') + 1) {
        return cardClasses[1][1] === 'A';
    }

    if (target.className.indexOf('stack') + 1) {
        return cardClasses[1][1] === 'K';
    }

    parent = target;
    while (parent.className.indexOf('home') < 0 && parent.className.indexOf('stack') < 0) {
        parent = parent.parentNode;
    }
    if (parent.className.indexOf('home') + 1) {
        matrix = {
            '2': 'A',
            '3': '2',
            '4': '3',
            '5': '4',
            '6': '5',
            '7': '6',
            '8': '7',
            '9': '8',
            '=': '9',
            'J': '=',
            'Q': 'J',
            'K': 'Q'
        };
        if (targetClasses[1][1] !== matrix[cardClasses[1][1]]) {
            return false;
        }
        if (targetClasses[1][0] !== cardClasses[1][0]) {
            return false;
        }
        if (card.lastChild && card.lastChild.className.substring(0, 5) === 'card ') {
            return false;
        }
    } else if (parent.className.indexOf('stack') + 1) {
        matrix = {
            'K': 'A',
            'Q': 'K',
            'J': 'Q',
            '=': 'J',
            '9': '=',
            '8': '9',
            '7': '8',
            '6': '7',
            '5': '6',
            '4': '5',
            '3': '4',
            '2': '3'
        };
        if (targetClasses[1][1] !== matrix[cardClasses[1][1]]) {
            return false;
        }
        switch (targetClasses[1][0]) {
            case 'D':
            case 'H':
                if (cardClasses[1][0] !== 'S' && cardClasses[1][0] !== 'C') {
                    return false;
                }
                break;
            case 'C':
            case 'S':
                if (cardClasses[1][0] !== 'D' && cardClasses[1][0] !== 'H') {
                    return false;
                }
                break;
        }

    }
    return true;
};

app.placeCard = function(card, target) {
    // FIXME на этом этапе может сохраняться moving класс у card, почему?
    var i, lastChild, flipped = false;

    target.appendChild(card);
    // flip old parent to get visible.
    for (i = 0; i < 7; i += 1) {
        lastChild = app.el['stack' + (i+1)];
        while (lastChild.lastChild && (lastChild.lastChild.className.indexOf('card') + 1)) {
            lastChild = lastChild.lastChild;
        }
        if (lastChild.className.split(' ')[2] === 'flipped') {
            flipped = true;
            lastChild.className = lastChild.className.replace(' flipped', '');
            break;
        }
    }

    if (!app.gameEnd()) {
        app.writeMove('move', card, app.data.oldParent, target, flipped);
        if (app.canComplete()) {
            app.el['btn3'].className = app.el['btn3'].className.replace(' disabled', '');
        }
    }
};

app.getX = function(event) {
    return event.targetTouches ? event.targetTouches[0].clientX : event.pageX;
};

app.getY = function(event) {
    return event.targetTouches ? event.targetTouches[0].clientY : event.pageY;
};

app.cacheDND = function(event) {
    var i,
        j,
        targPos,
        rec = app.data.card.getBoundingClientRect(),
        stackTop = app.el['stack1'].getBoundingClientRect().top;
    // FIXME теперь это можно из стилей вытащить вроде как.

    app.data.offset = [app.getX(event) - rec.left, app.getY(event) - rec.top];
    app.data.size = [rec.right - rec.left, rec.bottom - rec.top];
    app.data.zones = [];

    for (i = 0; i < 4; i += 1) {
        j = app.el['home' + (i+1)];
        while (j.lastChild && j.lastChild.className !== app.data.card.className && j.lastChild.className.split(' ')[0] === 'card') {
            j = j.lastChild;
        }
        targPos = j.getBoundingClientRect();
        app.data.zones.push({
            xmin: targPos.left,
            xmax: targPos.left + app.data.size[0],
            ymin: targPos.top,
            ymax: targPos.top + app.data.size[1],
            target: j
        });
    }
    for (i = 0; i < 7; i += 1) {
        j = app.el['stack' + (i+1)];
        while (j.lastChild && j.lastChild.className !== app.data.card.className && j.lastChild.className.split(' ')[0] === 'card') {
            j = j.lastChild;
        }
        // последняя карта стека это необычная дропзона, с топ координатой равной топ самого стека
        // также раз такая пьянка то для скорости применяем хак - запоминаем высоту первого стека...
        targPos = j.getBoundingClientRect();
        app.data.zones.push({
            xmin: targPos.left,
            xmax: targPos.left + app.data.size[0],
            ymin: stackTop,
            ymax: targPos.top + app.data.size[1],
            target: j
        });
    }
};

app.drag = function(event) {
    // проверяем что это не второй палец при мультитаче...
    if (app.data.card) {
        return;
    }

    app.data.card = getClickedCard(event);
    if (app.data.card === null) {
        return;
    }

    // реального движения или второго клика не было - пока "как дроп" не обрабатываем...
    handleUnpress(document, function() {
        document.onmousemove = document['ontouchmove'] = null;
        document.onmouseup = document['ontouchend'] = null;
        app.data.card = null;
    });

    // здесь пора задуматься о включении игрового таймера

    // второй клик, обработка как дабл-клик. Этот хэндлер позднее снимется при реальном движении или по истечении 0.5с
    handlePress(app.el['table'], function(event) {
        // первый вариант запуска таймера - попытка даблклика
        if (app.data.moves === 1) {
            app.data.timer = new Date().getTime();
        }
        app.tryMoveHome(getClickedCard(event));
        handlePress(app.el['table'], app.drag);
    });

    // снятие дабл-клик-хэндлера по истечение 0.5с
    setTimeout(function() {
        handlePress(app.el['table'], app.drag);
    }, 500);

    app.data.oldXY = app.getX(event) + ';' + app.getY(event);

    // обработка мува
    document.onmousemove = document['ontouchmove'] = function(event) {
        // смотрим реально ли мы сдвинули мышь.
        var oldXY = app.data.oldXY.split(';');
        if ((Math.abs(oldXY[0] - app.getX(event)) < 8) && (Math.abs(oldXY[1] - app.getY(event)) < 8)) {
            return;
        }

        // второй и последний вариант запуска таймера - начало драг и дропа
        if (app.data.moves === 1) {
            app.data.timer = new Date().getTime();
        }
        document.onmousemove = document['ontouchmove'] = function(event) {
            if (app.data.oldXY === app.getX(event) + ';' + app.getY(event)) {
                app.stopRender = true;
                return;
            }

            app.move(event);
        };
        // нормальный клик (отмена дабл-клика)
        handlePress(app.el['table'], app.drag);

        // дроп для любителей таскать карту за краешек, когда курсор мыши отстает от карты...
        handleUnpress(document, function(event) {
            document.onmousemove = document['ontouchmove'] = null;
            document.onmouseup = document['ontouchend'] = null;
            app.data.card.className = app.data.card.className.replace(' moving', '');
            app.drop(event);
        });

        app.data.oldParent = app.data.card.parentElement;
        app.cacheDND(event);
        app.data.card.className += ' moving';
        document.body.appendChild(app.data.card);

        app.stopRender = true;
        app.move(event);
    };
};

app.getDZ = function(center) {
    var rect, i;
    for (i = 0; i < app.data.zones.length; i += 1) {
        rect = app.data.zones[i];
        if ((center[0] > rect.xmin) && (center[0] < rect.xmax) && (center[1] > rect.ymin) && (center[1] < rect.ymax)) {
            return rect.target;
        }
    }
    return null;
};

app.realMove = function() {
    if (app.stopRender) {
        return;
    }
    if (!app.data.drawn) {
        app.data.card.style.cssText = app.data.cardCss;

        if (app.data.currentTarget && app.data.targetClass.length) {
            var rect = app.data.currentTarget.getBoundingClientRect(),
                coor = 'translate(' + rect.left + 'px,' + rect.top + 'px)',
                tran = '-ms-transform: ' + coor + '; -webkit-transform: ' + coor + '; transform: ' + coor + ';',
                size = 'width: ' + app.data.size[0] + 'px; height: ' + app.data.size[1] + 'px;',
                back = 'background-color: ' + (app.data.targetClass.indexOf('invalid') >= 0 ? 'rgba(255,0,0,0.5)' : 'rgba(0,255,0,0.5)');

            app.el['mark'].style.cssText = 'visibility: visible; ' + tran + size + back;

        } else {
            app.el['mark'].style.cssText = 'visibility: hidden;';
        }
        app.data.drawn = true;
    }
    window.requestAnimationFrame(app.realMove);
};

app.move = function(event) {
    app.data.drawn = false;

    var coor = 'translate(' + (app.getX(event) - app.data.offset[0]) + 'px,' + (app.getY(event) - app.data.offset[1]) + 'px)',
        size = 'width: ' + app.data.size[0] + 'px; height: ' + app.data.size[1] + 'px;';

    app.data.cardCss = '-ms-transform: ' + coor + '; -webkit-transform: ' + coor + '; transform: ' + coor + ';' + size;
    app.data.currentTarget = app.getDZ([app.getX(event) - app.data.offset[0] + app.data.size[0] / 2, app.getY(event) - app.data.offset[1] + app.data.size[1] / 2]);

    app.data.oldTarget = app.data.currentTarget;
    if (app.data.currentTarget !== null) {
        app.data.targetClass = app.canDrop(app.data.card, app.data.currentTarget) ? 'valid' : 'invalid';
    }

    if (app.stopRender) {
        app.stopRender = false;
        app.realMove();
    }

};

app.drop = function() {
    app.stopRender = true;
    app.data.card.style.cssText = '';
    app.el['mark'].style.cssText = '';
    if (app.data.currentTarget) {
        app.data.currentTarget.className = app.data.currentTarget.className.replace(/ (in)?valid/, '');
        if (app.canDrop(app.data.card, app.data.currentTarget)) {
            app.placeCard(app.data.card, app.data.currentTarget);
            app.data.moves++;
        } else {
            app.data.oldParent.appendChild(app.data.card);
        }
    } else {
        app.data.oldParent.appendChild(app.data.card);
    }
    app.data.oldParent = null;
    app.data.currentTarget = null;
    app.data.card = null;
};

app.initHandlers = function() {
  document.ondragstart = cancelEvent;
  document.body.onselectstart = cancelEvent;
  app.el['deck'].onmouseup = app.el['deck'].ontouchend = cancelEvent;
  handlePress(app.el['table'], app.drag);
}

app.setupResize = function() {
    window.onresize = function(event) {
        document.body.style.display = 'none';
        clearTimeout(app.data.timeout);
        app.data.timeout = setTimeout(function() {
            document.body.style.display = '';

            // технически можно отследить поворот...
            //app.el['console'].innerHTML += screen.width + ':' + screen.height + '<br>';

            // но надо однозначно установить алгоритм расчета размеров
            app.doLayout();
        }, 200);
    };
}

app.initXhr = function() {
    app.xhr = new XMLHttpRequest();

    if (app.xhr.onload === undefined) { // это IE 8/9, в них старый XMLHttpRequest
        if (!window['XDomainRequest']) {
            throw new Error("Not supported");
        }
        app.xhr = new XDomainRequest(); // ..но есть XDomainRequest
    }
}

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
import App from './js/components/app';
import rootMiddleware from './js/middlewares/root';
import rootReducer from './js/reducers/root';
import recordActions from './js/actions/records';
import gameActions from './js/actions/games';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(rootMiddleware));

window.onload = function() {
  ReactDOM.render((
    <Provider store={store}> 
      <App />
    </Provider>
  ), document.getElementById('root'));
}

export default app;