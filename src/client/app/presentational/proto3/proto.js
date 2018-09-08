/**
 * @overview App initializer
 *
 * @desc
 * App combiner and initializer
 */
import { NUM_POINTS, ALPHA_POINTS_RATIO, SELECTION_SPHERE_RADIUS, SELECTION_SCALAR_MODIFIER, SHOW_STATS, ALPHA_CLOUD_X_ROTATION_SPEED, ALPHA_CLOUD_Y_ROTATION_SPEED, ALPHA_CLOUD_Z_ROTATION_SPEED, BETA_CLOUD_X_ROTATION_SPEED, BETA_CLOUD_Y_ROTATION_SPEED, BETA_CLOUD_Z_ROTATION_SPEED } from './constants';
import PointCloud from './point-cloud';

import { ALPHA_MATERIAL, BETA_MATERIAL } from './materials';
import { SelectionShell, SelectionSphere } from './selection';
import { camera, scene, renderer, stats } from './stage';
import log from './log';

import THREE from './three';
import TWEEN from './Tween';



/**
 * @vars
 * instantiate variables
 */
let largestSelectionAngle = Math.atan(SELECTION_SPHERE_RADIUS); // TODO: @barrett please explain?
let alphaPointCloud, betaPointCloud, selectionSphere, selectionPoint, selectionShell;
let cursorPosition, raycaster;
let initialAnimationComplete = false;



/**
 * @function
 * Mouse move event listener
 */
function onMouseMove(event) {
	event.preventDefault();
	cursorPosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	cursorPosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}



/**
 * @function
 * Initialize
 */
function init() {

	// Initialize cursorPostion and raycaster
	cursorPosition = new THREE.Vector2(-1, 1); // Initialize to top left corner
	raycaster = new THREE.Raycaster();

	// Add event listeners
	window.addEventListener('mousemove', onMouseMove, false);

	// Intialize point group
	alphaPointCloud = new PointCloud(NUM_POINTS * ALPHA_POINTS_RATIO, ALPHA_MATERIAL, ALPHA_CLOUD_X_ROTATION_SPEED, ALPHA_CLOUD_Y_ROTATION_SPEED, ALPHA_CLOUD_Z_ROTATION_SPEED);
	betaPointCloud = new PointCloud(NUM_POINTS, BETA_MATERIAL, BETA_CLOUD_X_ROTATION_SPEED, BETA_CLOUD_Y_ROTATION_SPEED, BETA_CLOUD_Z_ROTATION_SPEED);

	// Add objects to scene
	selectionShell = new SelectionShell();
	scene.add(selectionShell);
	scene.add(alphaPointCloud);
	scene.add(betaPointCloud);

	selectionSphere = new SelectionSphere();
	scene.add(selectionSphere);

	// Start animations
	let count = 0;
	[alphaPointCloud, betaPointCloud].forEach(cloud => {
		// Start rotating
		cloud.startRotation();

		// Start explosion
		cloud.startInitialAnimation(() => {
			count++;
			if (count >= 2) {
				//log.debug('init() - initialAnimation complete.');
				initialAnimationComplete = true;
			}
		});
	});

	log.debug('init() - Animation initialized', scene.children);
}



/**
 * @function
 * Animation loop - step
 */
function animate() {
	// Update all tweens
	TWEEN.update();

	// Render scene
	render();

	// Update stats
	if (SHOW_STATS) {
		stats.update();
	}

	// Loop
	requestAnimationFrame(animate);
}



/**
 * @function
 * Render
 */
function render() {

	// Only select points if the initial animation is done.
	if (initialAnimationComplete) {

		// Update raycaster
		raycaster.setFromCamera(cursorPosition, camera);

		// Check if raycaster intersects selectionShell
		let intersections = raycaster.intersectObject(selectionShell, true);
		let intersection = intersections.length > 0 ? intersections[0].point : null;

		// If intersection, move selectionSphere to the intersection point
		if (intersection) {
			selectionPoint = intersection.clone();
			// selectionPoint.setLength(SELECTION_SPHERE_DEPTH); // Moves sphere inside SelectionShell
			selectionSphere.set(selectionPoint);
		} else {
			selectionSphere.clear();
		}

		// Check what points are in the selection sphere
		let points = alphaPointCloud.geometry;

		points.vertices.forEach(point => {
			let target;

			// TODO: @barrett to provide more explanation of the math in this section
			if (intersection) {
				// Transform vector to world coordinates and then check if inside selectionSphere
				let vertexTransform = point.home.clone().applyMatrix4(alphaPointCloud.matrixWorld);
				let selected = selectionSphere.containsPoint(vertexTransform);

				if (selected) {
					let angleToPoint = vertexTransform.angleTo(selectionPoint);
					let targetScalar = SELECTION_SCALAR_MODIFIER * (1 - Math.pow(angleToPoint/largestSelectionAngle, 1/6)) + 1;
					target = point.home.clone().multiplyScalar(targetScalar);
				}
			}

			point.setTarget(target);
			point.move();
		});

	}

	// Render scene
	renderer.render(scene, camera);
}



// Intialize and run animation loop ----------------------------------------------
window.addEventListener('load', function () {
	setTimeout(function () { // For some reason, the FPS goes really low if we run stuff immediately.
		init();
		animate();
	}, 500);
});
