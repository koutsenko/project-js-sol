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
  el: {},
  data: {
    timeout: undefined
  }
};

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
            app.el['home' + i].style.left = rnd((i+3) * unitSize * 5 / 4);
        }
        for (var i = 0; i < 7; i++) {
            app.el['stack' + i].style.left = rnd(i * unitSize * 5 / 4);
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
                app.el['home' + i].style.left = rnd(unitSize / 4 + 2 * (i+3) * unitSize + fluid);
            }
            for (var i = 0; i < 7; i++) {
                app.el['stack' + i].style.left = rnd(unitSize / 4 + 2 * i * unitSize + fluid);
            }
        } else if (window.matchMedia("(min-aspect-ratio: 17/12)").matches) {
            //app.el['debug'].innerHTML = '17/12 < AR < 59/24';

            unitSize = document.documentElement.offsetHeight / 6,
                fluid = (((6 * document.documentElement.offsetWidth - 8.5 * 6* unitSize) / 42)+unitSize);
            app.el['deck'].style.left = rnd(unitSize / 4);
            app.el['open'].style.left = rnd(unitSize / 4 + fluid);
            app.el['status'].style.left = rnd(unitSize / 4 + 2*fluid);
            for (var i = 0; i < 4; i++) {
                app.el['home' + i].style.left = rnd(unitSize / 4 + (i+3)*fluid);
            }
            for (var i = 0; i < 7; i++) {
                app.el['stack' + i].style.left = rnd(unitSize / 4 + i*fluid);
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
        app.el['home' + i].style.width = rnd(unitSize);
    }
    for (var i = 0; i < 7; i++) {
        app.el['stack' + i].style.width = rnd(unitSize);
    }

    // высота элементов стола
    app.el['deck'].style.height =
        app.el['open'].style.height =
            app.el['status'].style.height = rnd(6*unitSize/5);
    for (var i = 0; i < 4; i++) {
        app.el['home' + i].style.height = rnd(6*unitSize/5);
    }
    for (var i = 0; i < 7; i++) {
        app.el['stack' + i].style.height = rnd(6*unitSize/5);
    }

    // верхняя координата зон первого ряда стола
    app.el['deck'].style.top =
        app.el['open'].style.top =
            app.el['status'].style.top =
                app.el['home0'].style.top =
                    app.el['home1'].style.top =
                        app.el['home2'].style.top =
                            app.el['home3'].style.top = rnd(unitSize/4);

    // верхняя координата зон второго ряда стола
    app.el['stack0'].style.top =
        app.el['stack1'].style.top =
            app.el['stack2'].style.top =
                app.el['stack3'].style.top =
                    app.el['stack4'].style.top =
                        app.el['stack5'].style.top =
                            app.el['stack6'].style.top = rnd(unitSize*17/10); // 1/4 + 6/5 + 1/4

    document.documentElement.style.fontSize = unitSize*1.2 + '%';
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