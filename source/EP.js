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
