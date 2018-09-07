/**
 * Router state
 * A redux-first routing model based on: https://github.com/mksarge/redux-first-routing
 */

import { parse } from 'query-string';



//-------------------------------------- Default State --------------------------------------

const defaultState = {
	pathname: '/',
	search: '',
	queries: {},
	hash: '',
};



//---------------------------------------- Actions ----------------------------------------
export const PUSH = 'ROUTER/PUSH';
export const push = href => ({
	type: PUSH,
	payload: href,
});

export const REPLACE = 'ROUTER/REPLACE';
export const replace = href => ({
	type: REPLACE,
	payload: href,
});

export const GO = 'ROUTER/GO';
export const go = index => ({
	type: GO,
	payload: index,
});

export const GO_BACK = 'ROUTER/GO_BACK';
export const goBack = () => ({
	type: GO_BACK,
});

export const GO_FORWARD = 'ROUTER/GO_FORWARD';
export const goForward = () => ({
	type: GO_FORWARD,
});

export const LOCATION_CHANGE = 'ROUTER/LOCATION_CHANGE';
export const locationChange = ({ pathname, search, hash }) => ({
	type: LOCATION_CHANGE,
	payload: {
		pathname,
		search,
		queries: parse(search),
		hash,
	}
});



//---------------------------------------- Reducer ----------------------------------------

export default function(state = defaultState, action) {
	switch (action.type) {
		case LOCATION_CHANGE:
			return {
				...state,
				...action.payload,
			};
		default:
			return state;
	}
}



//---------------------------------------- Middleware----------------------------------------

export const routerMiddleware = history => () => next => action => {
	switch (action.type) {
		case PUSH:
			history.push(action.payload);
			break;
		case REPLACE:
			history.replace(action.payload);
			break;
		case GO:
			history.go(action.payload);
			break;
		case GO_BACK:
			history.goBack();
			break;
		case GO_FORWARD:
			history.goForward();
			break;
		default:
			return next(action);
	}
};

//------------------------------------- Router Listener -------------------------------------

export function startRouterListener(history, store) {
	store.dispatch(locationChange({
		pathname: history.location.pathname,
		search: history.location.search,
		hash: history.location.hash,
	}));

	history.listen((location) => {
		store.dispatch(locationChange({
			pathname: location.pathname,
			search: location.search,
			hash: location.hash,
		}));
	});
}
