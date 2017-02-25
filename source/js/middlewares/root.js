import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';

import storageMiddleware  from './storage';
import timerMiddleware    from './timer';
import gameMiddleware     from './game';

export default applyMiddleware(thunk, storageMiddleware, timerMiddleware, gameMiddleware);
