import   React            from 'react'                    ;
import   ReactDOM         from 'react-dom'                ;
import { Provider }       from 'react-redux'              ;
import { createStore }    from 'redux'                    ;
import   MobileDetect     from 'mobile-detect'            ;

import   App              from 'components/app'           ;
import   rootMiddleware   from 'middlewares/_root'        ;
import   rootReducer      from 'reducers/_root'           ;
import   constantsActions from 'constants/actions'        ;
import   actionsApp       from 'actions/app'              ;
import   constantsLayout  from 'constants/layout'         ;
import   hashTools        from 'tools/hash'               ;
import   actionsGames     from 'actions/games'            ;

// import { composeWithDevTools }  from 'redux-devtools-extension' ;
// const composeEnhancers = composeWithDevTools({
//   maxAge: 5000  // 5000 actions in redux-devtools history instead of default 50
// });
// const store = createStore(rootReducer, composeEnhancers(rootMiddleware));
const md    = new MobileDetect(window.navigator.userAgent);
const store = createStore(rootReducer, rootMiddleware);

// предварительно проведем какую-то работу, еще до этапа рендера
const initGameState = function() {
  let cmd = hashTools.getHashCmd();
  let p1 = hashTools.getHashParm();

  if (cmd === 'load') {
    store.dispatch(actionsGames.load(p1));
    window.history.pushState('', '/', window.location.pathname);
  } else if (cmd === 'deal') {
    store.dispatch(actionsGames.deal(p1 || Date.now()));
  } else {
    store.dispatch(actionsGames.deal(Date.now()));
  }
}

let parent  = document.querySelector('#'+constantsLayout.rootId), child;
const getWHLT = function() {
  let rect = parent.getBoundingClientRect();

  let w = Math.round(rect.right - rect.left);
  let h = Math.round(rect.bottom - rect.top);
  let l = Math.round(rect.left);
  let t = Math.round(rect.top);

  return {w, h, l, t};
}

let resizeTimer;
const windowChangeHandler = function() {
  child.style.display = "none";
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    child.style.display = "";
    actionsApp.resize(md, getWHLT())(store.dispatch, store.getState);
  }, 200);
};

window.addEventListener('load', function() {
  initGameState();
  actionsApp.resize(md, getWHLT())(store.dispatch, store.getState);
  child = ReactDOM.findDOMNode(ReactDOM.render((
    <Provider store={store}>
      <App />
    </Provider>
  ), parent));

  window.addEventListener('resize', windowChangeHandler.bind(this), {
    'passive': true
  });
  window.addEventListener('scroll', windowChangeHandler.bind(this), {
    'passive': true
  });

  // выключаем браузерные жесты на iPhone кроме неотключаемого history swipe. Это можно было бы сделать через CSS, но сафари не умеет в touch-action: none
  ["gesturestart", "gesturechange", "gestureend", "touchstart", "touchmove", "touchend"].forEach(function(eventName) {
    child.addEventListener(eventName, function(event) {
      event.preventDefault();
    }, {
      'passive': true
    });
  });
});