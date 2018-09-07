/**
 * @overview Production Redux store
 *
 * @description
 * Create combined Redux store containing browser history, reducers and middleware.
 *
 * @author brmh
 */
import { createStore, compose } from 'redux';

/**
 * Configures the redux store for production
 * @param  {Object} middleware   A middleware object
 * @param  {Object} reducers     A set of combined reducers
 * @param  {Object} initialState An object describing the initial state
 * @return {Object}              The new redux store
 */
export default function configureStore(middleware, reducers, initialState) {
	return createStore(reducers, initialState, compose(middleware));
}
