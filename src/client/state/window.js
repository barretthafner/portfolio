/**
 * UI redux state
 *
 * Defines Redux actions and reducer using pattern defined by redux action library
 * https://redux-actions.js.org/
 */

import { createAction, handleActions, combineActions } from 'redux-actions';
import isEqual from 'lodash/isEqual';
import roundTo from 'utils/round-to';
import { getWindowSize } from 'utils/resize';




//------------------------------------- Helper Functions -------------------------------------

const composeWindowSize = () => {
	const windowSize = getWindowSize();
	const aspect = roundTo(windowSize.width / windowSize.height, 6);
	return {
		aspect,
		isPortrait: aspect < 1,
		...windowSize,
	};
};



//-------------------------------------- Defaults --------------------------------------

const DEFAULT_STATE = {
	size: composeWindowSize(),
};



//---------------------------------------- Actions ----------------------------------------

const updateResize = createAction('RESIZE', size => ({ size }));

export const resize = () =>
	(dispatch, getState) => {
		const size = composeWindowSize();
		if (!isEqual(size, getState().window.size)) dispatch(updateResize(size));
	};



//---------------------------------------- Reducer ----------------------------------------
// Read more here: https://redux-actions.js.org/docs/introduction/Tutorial.html

export default handleActions({
	[combineActions(
		updateResize,
	)](state, { payload }) { return { ...state, ...payload }; },
}, DEFAULT_STATE);
