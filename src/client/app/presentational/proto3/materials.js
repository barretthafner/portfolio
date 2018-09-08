/**
 * @overview Materials
 *
 * Materials (fabric) for the different stuff we're rendering
 */

import { ALPHA_POINTS_COLOR, BETA_POINTS_COLOR, POINT_SIZE } from './constants';



/**
 * @const
 * Alpha (purple/blue) material
 */
export const ALPHA_MATERIAL = new THREE.PointsMaterial({
	color: ALPHA_POINTS_COLOR,
	size: POINT_SIZE,
	name: 'ALPHA_MATERIAL',
});

/**
 * @const
 * Beta (grey) material
 */
export const BETA_MATERIAL = new THREE.PointsMaterial({
	color: BETA_POINTS_COLOR,
	size: POINT_SIZE,
	name: 'BETA_MATERIAL',
});
