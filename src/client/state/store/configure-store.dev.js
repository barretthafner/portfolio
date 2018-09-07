/**
 * @overview Development Redux store
 *
 * @description
 * Create combined Redux store containing browser history, reducers and middleware.
 *
 * @author brmh
 */
import log from 'utils/log';

import { createStore, compose } from 'redux';
import { persistState } from 'redux-devtools';


/**
 * Parses current href for a dubug session key
 * Matches: ?debug_session=<key>
 * @return {String || null} Returns the debug session key or null
 */
function getDebugSessionKey() {
	const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
	return (matches && matches.length > 0)? matches[1] : null;
}

/**
 * Configures the redux store for development
 * @param  {Object} middleware   A middleware object
 * @param  {Object} reducers     A set of combined reducers
 * @param  {Object} initialState An object describing the initial state
 * @return {Object}              The new redux store
 */
export default function configureStore(middleware, reducers, initialState) {
	let enhancer;

	if (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
		enhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ maxAge: 200 })(
			middleware,
			persistState(getDebugSessionKey())
		);
	} else {
		log.debug('configureStore() - Install Redux DevTools chrome extension to debug Redux state');
		enhancer = compose(middleware);
	}

	const store = createStore(
		reducers,
		initialState,
		enhancer
	);

	// Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
	if (module.hot)
		module.hot.accept('../reducers', () => store.replaceReducer(require('../reducers')));

	return store;
}
