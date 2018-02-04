import   React            from 'react'                    ;
import   ReactDOM         from 'react-dom'                ;
import { Provider }       from 'react-redux'              ;
import { createStore }    from 'redux'                    ;

import   App              from 'components/app'           ;
import   rootMiddleware   from 'middlewares/_root'        ;
import   rootReducer      from 'reducers/_root'           ;
import   actionsApp       from 'actions/app'              ;
import   constantsLayout  from 'constants/layout'         ;
import   hashTools        from 'tools/hash'               ;
import   actionsGames     from 'actions/games'            ;

// import { composeWithDevTools }  from 'redux-devtools-extension' ;
// const composeEnhancers = composeWithDevTools({
//   maxAge: 5000  // 5000 actions in redux-devtools history instead of default 50
// });
// const store = createStore(rootReducer, composeEnhancers(rootMiddleware));
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

window.addEventListener('load', function() {
  const parent  = document.querySelector('#'+constantsLayout.rootId);

  initGameState();
  store.dispatch(actionsApp.resize(parent));
  ReactDOM.render((
    <Provider store={store}>
      <App />
    </Provider>
  ), parent);
});
