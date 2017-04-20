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
import actionConstants from './js/constants/actions';
import { composeWithDevTools } from 'redux-devtools-extension';

import MobileDetect from 'mobile-detect';

const composeEnhancers = composeWithDevTools({
  maxAge: 5000  // 5000 actions in redux-devtools history instead of default 50
});
const store = createStore(rootReducer, composeEnhancers(rootMiddleware));

window.onload = function() {
  let md = new MobileDetect(window.navigator.userAgent);
  if (md.phone()) {
    store.dispatch({
      type: actionConstants.FX_MINI
    });
  }

  // выключаем браузерные жесты на iPhone кроме history swipe. Это можно было бы сделать через CSS, но сафари не умеет в touch-action: none
  ["gesturestart", "gesturechange", "gestureend", "touchstart", "touchmove", "touchend"].forEach(function(eventName) {
    document.body.addEventListener(eventName, function(event) {
      event.preventDefault();
    });
  });

  ReactDOM.render((
    <Provider store={store}>
      <App />
    </Provider>
  ), document.getElementById('root'));
}
