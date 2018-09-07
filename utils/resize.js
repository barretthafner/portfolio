import { getPixelRatio } from './pixel-ratio';



/**
 * Get window size with site settings constraints
 *
 * @return {object}
 */
export function getWindowSize() {
	const { innerHeight, innerWidth } = window;
	const { offsetWidth, offsetHeight } = document.documentElement;

	// Get width and height without potential scrollbars
	const width = (innerWidth > offsetWidth && offsetWidth > 0) ? offsetWidth : innerWidth;
	const height = (innerHeight > offsetHeight && offsetHeight > 0) ? offsetHeight : innerHeight;

	return {
		height,
		innerHeight,
		innerWidth,
		offsetHeight,
		offsetWidth,
		pixelRatio: getPixelRatio(),
		width,
	};
}



/**
 * Bind resize events
 *
 * @param {function} fn
 * @param {integer} threshold - in miliseconds
 *
 * @return {function} listener
 */
import bowser from 'bowser';
import debounce from 'lodash/debounce';

export function bindResizeEvents(fn, threshold = 200) {
	const listener = threshold ? debounce(fn, threshold) : fn;

	if (bowser.tablet || bowser.mobile) {
		window.addEventListener('orientationchange', listener);
	}

	window.addEventListener('resize', listener);

	return listener;
}



/**
 * Bind resize events
 *
 * @param {function} listener
 */
export function unBindResizeEvents(listener) {
	if (bowser.tablet || bowser.mobile) {
		window.removeEventListener('orientationchange', listener);
	}

	window.removeEventListener('resize', listener);
}
