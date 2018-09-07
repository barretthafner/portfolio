/**
 * UI redux state
 *
 * Defines Redux actions and reducer using pattern defined by redux action library
 * https://redux-actions.js.org/
 */

import { createAction, handleActions, combineActions } from 'redux-actions';



//-------------------------------------- Default State --------------------------------------

const defaultState = {
	title: '',
	showLoader: true
};



//---------------------------------------- Actions ----------------------------------------

export const updateTitle = createAction('UPDATE_TITLE', title => ({ title }));
export const showLoader = createAction('SHOW_LOADER', showLoader => ({ showLoader }));



//---------------------------------------- Reducer ----------------------------------------
// Read more here: https://redux-actions.js.org/docs/introduction/Tutorial.html

export default handleActions({
	[combineActions(
		updateTitle,
		showLoader
	)](state, { payload }) { return { ...state, ...payload }; }
}, defaultState);


//---------------------------------------- Middleware----------------------------------------

// export const uiMiddleware =  ({ dispatch }) => next => action => {
// 	if (action.type === LOCATION_CHANGE) {
// 		// do something
// 	}
// 	return next(action);
// };
