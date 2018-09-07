/**
 * Get device pixel ratio
 */

import roundTo from './round-to';

/**
 * DPI settings
 */
const BASE_DPI = 96;
const BASE_DPCM = 37.5;

/**
 * Detects if given density is true for current display
 * @src http://stackoverflow.com/a/20413768/799327
 * @private
 * @param {number} intensity
 */
function testPixelDensity(density) {
	return (
		(
			window.matchMedia &&
			(
				window.matchMedia('only screen and (min-resolution: ' + Math.floor(BASE_DPI * density) + 'dpi), only screen and (min-resolution: ' + density + 'dppx), only screen and (min-resolution: ' + roundTo(BASE_DPCM * density) + 'dpcm)').matches ||
				window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: ' + density + '), only screen and (-o-min-device-pixel-ratio: ' + density + '/1), only screen and (min--moz-device-pixel-ratio: ' + density + '), only screen and (min-device-pixel-ratio: ' + density + ')').matches
			)
		) || (
			window.devicePixelRatio && window.devicePixelRatio > density
		)
	);
}

/**
 * DPI breakpoints
 */
const HIGH_DENSITY_RATIO = 1.3,
	RETINA_RATIO = 2;

/**
 * Select default images based on device width
 * @private
 */
export function getPixelRatio() {
	let ratio = 1;

	if (testPixelDensity(RETINA_RATIO)) {
		ratio = RETINA_RATIO;
	} else if (testPixelDensity(HIGH_DENSITY_RATIO)) {
		ratio = HIGH_DENSITY_RATIO;
	}

	return ratio;
}

/**
 * Detect pixel ratio
 */
const PIXEL_RATIO = getPixelRatio();
export default PIXEL_RATIO;
