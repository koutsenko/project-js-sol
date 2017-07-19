import   React            from 'react'                    ;
import   ReactDOM         from 'react-dom'                ;
import { Provider }       from 'react-redux'              ;
import { createStore }    from 'redux'                    ;
import   MobileDetect     from 'mobile-detect'            ;

import   App              from 'components/app'           ;
import   rootMiddleware   from 'middlewares/_root'        ;
import   rootReducer      from 'reducers/_root'           ;
import   actionConstants  from 'constants/actions'        ;

// import { composeWithDevTools }  from 'redux-devtools-extension' ;
// const composeEnhancers = composeWithDevTools({
//   maxAge: 5000  // 5000 actions in redux-devtools history instead of default 50
// });
// const store = createStore(rootReducer, composeEnhancers(rootMiddleware));
const store = createStore(rootReducer, rootMiddleware);

const getWH = function() {
  let w = Math.max(document.documentElement.clientWidth , window.innerWidth   || 0);
  let h = Math.max(document.documentElement.clientHeight, window.innerHeight  || 0);

  return {w, h};
}

window.onresize = function() {
  let {w, h} = getWH();
  let m = store.getState().fx.mini;

  if (!m && ((w < 480) || (h < 480))) {
    store.dispatch({ type: actionConstants.FX_MINI      });
  } else if (m && ((w >= 480) && (h >= 480))) {
    store.dispatch({ type: actionConstants.FX_NOT_MINI  });
  }
};

window.onload = function() {
  let md      = new MobileDetect(window.navigator.userAgent);
  let {w, h}  = getWH();
  if (md.phone() || (w < 480) || (h < 480)) {
    store.dispatch({
      type: actionConstants.FX_MINI
    });
  }

  // выключаем браузерные жесты на iPhone кроме неотключаемого history swipe. Это можно было бы сделать через CSS, но сафари не умеет в touch-action: none
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
};