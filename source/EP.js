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

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
import App from './js/components/app';
import rootMiddleware from './js/middlewares/_root' ;
import rootReducer    from './js/reducers/_root'    ;
import recordActions  from './js/actions/records'   ;
import gameActions    from './js/actions/games'     ;
import { composeWithDevTools } from 'redux-devtools-extension';

const composeEnhancers = composeWithDevTools({
  maxAge: 5000  // 5000 actions in redux-devtools history instead of default 50
});
const store = createStore(rootReducer, composeEnhancers(rootMiddleware));

window.onload = function() {
  // выключаем браузерные жесты на iPhone кроме history swipe. Это можно было бы сделать через CSS, но сафари не умеет в touch-action: none
  document.body.ongesturestart = document.body.ongesturechange = document.body.ongestureend = function(event) {
    event.preventDefault();
  }
  ReactDOM.render((
    <Provider store={store}>
      <App />
    </Provider>
  ), document.getElementById('root'));
}
