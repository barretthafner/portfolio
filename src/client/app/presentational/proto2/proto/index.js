
import CONST from './Constants';
import PointCloud from './PointCloud';

import { greyMaterial, purpleMaterial } from './Materials';
import { SelectionShell, SelectionSphere } from './Selection';
import { camera, scene, renderer, stats } from './ThreeInit';

// instantiate variables ---------------------------------------------------------
let purplePointCloud, greyPointCloud, selectionSphere, selectionPoint, largestSelectionAngle, selectionShell;
let cursorPosition, raycaster;
let initialAnimationComplete = false;

// intialize and run animation loop ----------------------------------------------
init();
animate();

// intialize function ------------------------------------------------------------
function init() {

	// initialize cursorPostion and raycaster
	cursorPosition = new THREE.Vector2(-1, 1); // initialize to top left corner
	raycaster = new THREE.Raycaster();

	// add event listeners
	window.addEventListener('mousemove', onMouseMove, false);

	// intialize point group
	purplePointCloud = new PointCloud(CONST.NUM_POINTS * CONST.PURPLE_POINTS_RATIO, purpleMaterial);
	greyPointCloud = new PointCloud(CONST.NUM_POINTS, greyMaterial);

	// add objects to scene
	selectionShell = new SelectionShell();
	scene.add(selectionShell);
	scene.add(purplePointCloud);
	scene.add(greyPointCloud);

	selectionSphere = new SelectionSphere();
	scene.add(selectionSphere);

	largestSelectionAngle = Math.atan((CONST.SELECTION_SPHERE_RADIUS + 24)/CONST.SELECTION_SPHERE_DEPTH);

	// start animations
	purplePointCloud.rotateAnimation.start();
	greyPointCloud.rotateAnimation.start();
	(() => {
		let count = 0;
		[purplePointCloud, greyPointCloud].forEach(cloud => {
			cloud.startInitialAnimation(() => {
				count++;
				if (count >= 2) {
					console.log("initialAnimation Complete!");
					initialAnimationComplete = true;
				}
			});
		});
	})();


	console.log(scene.children);
}

// animate function ------------------------------------------------------------------------
function animate() {

	TWEEN.update();
	render();
	if (CONST.SHOW_STATS) {
		stats.update();
	}
	requestAnimationFrame(animate);
}

// render function ------------------------------------------------------------------------
function render() {

	if (initialAnimationComplete) {

		// update raycaster
		raycaster.setFromCamera(cursorPosition, camera);
		//check if raycaster intersects selectionShell
		let intersections = raycaster.intersectObject(selectionShell, true);
		let intersection = intersections.length > 0 ? intersections[0].point : null;

		// if intersection, move selectionSphere to the intersection point
		if (intersection) {
			selectionPoint = intersection.clone();
			selectionPoint.setLength(CONST.SELECTION_SPHERE_DEPTH);
			selectionSphere.set(selectionPoint);
		} else {
			selectionSphere.clear();
		}

		// check what points are in the selection sphere
		let points = purplePointCloud.geometry;
		points.vertices.forEach( vertex => {
			if (intersection) {
				// transform vector to world coordinates and then check if inside selectionSphere
				let vertexTransform = vertex.home.clone().applyMatrix4(purplePointCloud.matrixWorld);
				let selected = selectionSphere.containsPoint(vertexTransform);

				if (selected) {
					let angleToPoint = vertexTransform.angleTo(selectionPoint);
					let targetScalar = 0.7 * (1 - Math.pow(angleToPoint/largestSelectionAngle, 1/6)) + 1;
					vertex.target = vertex.home.clone().multiplyScalar(targetScalar);
				} else {
					vertex.target = vertex.home;
				}
			} else {
				vertex.target = vertex.home;
			}
			vertex.move();
		});

	}

	renderer.render(scene, camera);
}

// On mousemove capture cursor position
function onMouseMove(event) {
	event.preventDefault();
	cursorPosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	cursorPosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
