// Materials.js

import CONST from './Constants';

// initialize materials
export const greyMaterial = new THREE.PointsMaterial({
	color: CONST.GREY_POINTS_COLOR,
	size: CONST.POINT_SIZE,
	name: 'greyMaterial',
});

export const purpleMaterial = new THREE.PointsMaterial({
	color: CONST.PURPLE_POINTS_COLOR,
	size: CONST.POINT_SIZE,
	name: 'purpleMaterial',
});