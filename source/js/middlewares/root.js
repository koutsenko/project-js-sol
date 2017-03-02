import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';

import animationsMiddleware from './animations';
import storageMiddleware    from './storage';
import timerMiddleware      from './timer';
import gameMiddleware       from './game';

export default applyMiddleware(thunk, animationsMiddleware, storageMiddleware, timerMiddleware, gameMiddleware);
