/**
 * Store
 * Configure redux store based upon environment
 * Dev or production stores will be resolved by webpack
 */

import { applyMiddleware, combineReducers } from 'redux';

import configureStore from 'configure-store';
import createHistory from 'history/createBrowserHistory';
import thunkMiddleware from 'redux-thunk';

import { routerMiddleware, startRouterListener } from '../router';
// import { uiMiddleware } from '../ui';

import * as appReducers from '../reducers';



const history = createHistory();
const middleware = applyMiddleware(thunkMiddleware, routerMiddleware(history)/*, uiMiddleware*/);
const reducers = combineReducers({ ...appReducers });

export const store = configureStore(middleware, reducers);

startRouterListener(history, store);
