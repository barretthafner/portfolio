
const CAMERA_Z = 900;
const FRUSTUM_REAR = 5000;

const CLOUD_X_ROTATION_SPEED = 0.04;
const CLOUD_Y_ROTATION_SPEED = 0.04;
const CLOUD_Z_ROTATION_SPEED = 0.07;
const CLOUD_INNER_RADIUS = 600;
const CLOUD_OUTER_RADIUS = 800;
const CLOUD_INITIAL_X = -CLOUD_OUTER_RADIUS - 300;

const BACKGROUND_COLOR = 0x1e1e1e;
const FOG_START = 0//CAMERA_Z;
const FOG_END = CLOUD_OUTER_RADIUS * 1.4; //+ CAMERA_Z;

const NUM_POINTS = 1000;
const POINT_MIN_RADIUS = 1.2;
const POINT_SCALE_FACTOR = 2.2;
const POINT_SEGMENTS = 8;
const PURPLE_POINTS_RATIO = 0.35;

const GREY_POINTS_COLOR = 0x838383;
const PURPLE_POINTS_COLOR = 0x6251f3;

const LINES_COLOR = 0x4231d3;
const LINES_FADEOUT_TIMER = 2000;
const MIN_NUM_CONNECTIONS = 3;
const LINES_PROXIMITY_STEP = 10;

const HELPER_MESH_OPACITY = 0;

const SELECTION_SPHERE_RADIUS = 250;
const SELECTION_SCALE_FACTOR = 1.4;

const SHOW_STATS = true;


// instantiate variables ---------------------------------------------------------
let container, stats;
let camera, scene, renderer;
let cursorPosition, raycaster;
let cloudGroup, selectionShell, selectionSphere, pointGroup, lineGroup;
let greyMaterial, purpleMaterial, lineMaterial;

let showSelectionSphere;
let initialAnimationComplete;

// intialize and run animation loop ----------------------------------------------
init();
animate();

// intialize function ------------------------------------------------------------
function init() {

	// grab window size and pixel ratio
	const width = window.innerWidth;
	const height = window.innerHeight;
	const pixelRatio = window.devicePixelRatio;

	container = document.createElement('div');
	document.body.appendChild(container);

	// add event listeners
	window.addEventListener('mousemove', onMouseMove, false);
	window.addEventListener('resize', onWindowResize, false);

	// intialize stats object
	if (SHOW_STATS) {
		stats = new Stats();
		document.body.appendChild(stats.dom);
	}

	// initialize cursorPostion and raycaster
	cursorPosition = new THREE.Vector2();
	raycaster = new THREE.Raycaster();

	//initialize cameras
	camera = new THREE.PerspectiveCamera(60, width / height, 1, FRUSTUM_REAR);
	// camera.position.z = CAMERA_Z;

	// initialize sceness
	scene = new THREE.Scene();
	// scene.fog = new THREE.Fog( BACKGROUND_COLOR, FOG_START, FOG_END );

	// intialize renderer
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true });
	renderer.setSize(width, height);
	renderer.setPixelRatio(pixelRatio);
	renderer.setClearColor(BACKGROUND_COLOR);
	// renderer.autoClear = false;
	// renderer.sortObjects = false;
	document.body.appendChild(renderer.domElement);

	// initialize materials
	greyMaterial = new THREE.MeshBasicMaterial({
		color: GREY_POINTS_COLOR,
		depthWrite: false,
		transparent: true,
		opacity: 1.0
	});

	purpleMaterial = new THREE.MeshBasicMaterial({
		color: PURPLE_POINTS_COLOR,
		depthWrite: false,
		transparent: true,
		opacity: 1.0
	});

	lineMaterial = new THREE.LineBasicMaterial({
			color: LINES_COLOR,
			linewidth: 2,
			depthWrite: false,
			transparent: true,
			opacity: 0
		});

	// create the object used to determine if points are selected
	selectionSphere = new THREE.Sphere();

	// create a Sphere for showing the selection sphere
	const showSelectionSphereGeometry = new THREE.SphereGeometry(SELECTION_SPHERE_RADIUS, 32, 32);
	const showSelectionSphereMaterial = new THREE.MeshBasicMaterial({
		color: 0xF66717,
		transparent: true,
		opacity: HELPER_MESH_OPACITY
	});
	showSelectionSphere = new THREE.Mesh(showSelectionSphereGeometry, showSelectionSphereMaterial);

	// initialize selection Shell
	const shellGeometry = new THREE.SphereGeometry(CLOUD_OUTER_RADIUS, 32, 32);
	const shellMaterial = new THREE.MeshBasicMaterial({
		color: 0x6698CB,
		transparent: true,
		opacity: HELPER_MESH_OPACITY,
		side: THREE.DoubleSide
	});
	selectionShell = new THREE.Mesh(shellGeometry, shellMaterial);

	// intialize point group
	pointGroup = generatePointGroup();

	// initialize line group connecting purple points
	lineGroup = generateLineGroup(pointGroup);

	// initialize cloudGroup
	cloudGroup = new THREE.Group();
	cloudGroup.add(selectionShell);
	cloudGroup.add(pointGroup);
	cloudGroup.add(lineGroup);

	// set group intial parameters
	// cloudGroup.scale.setScalar(0.001);
	// cloudGroup.position.setZ(-100000);
	camera.position.setX(-CLOUD_INITIAL_X);


	// Tween animations --------------------------------------------

	// cloudGroup.translationTween = new TWEEN.Tween(cloudGroup.position)
	// 	.to({ x: 0, z: CLOUD_INITIAL_X }, 8000)
	// 	.easing(TWEEN.Easing.Sinusoidal.In);

	// cloudGroup.rotationTween = new TWEEN.Tween(cloudGroup.rotation)
	// 	.to({
	// 		x: "+" + CLOUD_X_ROTATION_SPEED,
	// 		y: "+" + CLOUD_Y_ROTATION_SPEED,
	// 		z: "+" + CLOUD_Z_ROTATION_SPEED
	// 	})
	// 	.onStart(function() {
	// 		setTimeout(function() {
	// 			cloudGroup.translationTween.start();
	// 		}, 1000)
	// 	})
	// 	.repeat(Infinity);

	// cloudGroup.warpTween = new TWEEN.Tween(cloudGroup.position)
	// 	.to({
	// 		x: CLOUD_INITIAL_X,
	// 		z: 0
	// 	}, 2500)
	// 	.easing(TWEEN.Easing.Quadratic.Out)
	// 	.onStart(function() {
	// 		setTimeout(function() {
	// 			cloudGroup.rotationTween.start();
	// 		}, 2300)
	// 	})
	// 	.onComplete(function() {
	// 		initialAnimationComplete = true;
	// 	});

	// cloudGroup.warpTween = new TWEEN.Tween(cloudGroup.scale)
	// 	.to({x: 1, y: 1, z: 1}, 800)
	// 	.delay(1000)
	// 	.onStart(function() { cloudGroup.xOffsetTween.start() });


	cloudGroup.tweens = {
		init: new TWEEN.Tween()
			.onStart(function() {
				cloudGroup.tweens.rotate.start();
				cloudGroup.tweens.translate.start();
			}),

		rotate: new TWEEN.Tween(cloudGroup.rotation)
			.to({
				x: "+" + CLOUD_X_ROTATION_SPEED,
				y: "+" + CLOUD_Y_ROTATION_SPEED,
				z: "+" + CLOUD_Z_ROTATION_SPEED
			})
			.repeat(Infinity),

		translate: new TWEEN.Tween(camera.position)
			.to({ x: 0, z: 1500 }, 8000)
			// .easing(TWEEN.Easing.Quadratic.Out)
			.onComplete(function() {
				cloudGroup.tweens.complete();
			}),

		complete: function() { initialAnimationComplete = true; }
	};

  // run tweens
	initialAnimationComplete = false;
	cloudGroup.tweens.init.start();

	// set render order
	pointGroup.renderOrder = 0;
	lineGroup.renderOrder = 1;
	showSelectionSphere.renderOrder = 2;
	selectionShell.renderOrder = 3;

	// add objects to scene
	scene.add(showSelectionSphere);
	scene.add(cloudGroup);
}


// render function ------------------------------------------------------------------------
function render() {

	if (initialAnimationComplete) {

		// set selectionSphere position to the center of the cloud with radius 0
		selectionSphere.set(cloudGroup.position, 0);
		showSelectionSphere.position.set(cloudGroup.position.x,cloudGroup.position.y,cloudGroup.position.z);

		// update raycaster
		raycaster.setFromCamera(cursorPosition, camera);
		//check if raycaster intersects selectionShell
		const intersect = raycaster.intersectObject(selectionShell, true);
		const intersectionFound = intersect.length > 0;

		// if intersection, move selectionSphere to the intersection point
		if (intersectionFound) {
			console.log(intersect.length);
			let intersectionPoint = intersect[0].point;
			let selectionSphereOrigin = new THREE.Vector3(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z);
			showSelectionSphere.position.set(selectionSphereOrigin.x, selectionSphereOrigin.y, selectionSphereOrigin.z);
			selectionSphere.set(selectionSphereOrigin, SELECTION_SPHERE_RADIUS);
			pointGroup.updateMatrixWorld();
		}

		lineGroup.children.forEach(function(line) {

			let selected = false;
			if (intersectionFound) {
				line.geometry.vertices.forEach(function(vertex) {
					let vector = vertex.clone();
					vector.applyMatrix4(line.matrixWorld);
					selected = selectionSphere.containsPoint(vector);
				});
			}

			if (selected) {
				line.tween.stop();
				line.material.opacity = 1;
				line.points.forEach(function(point) {
					point.tween.stop();
					point.scale.setScalar(point.originalScale * SELECTION_SCALE_FACTOR);
				});
			} else if (line.material.opacity === 1) {
				line.tween.start();
				line.points.forEach(function(point) {
					point.tween.start();
				});
			}
		});
	}
	renderer.render(scene, camera);
}



function animate() {
	requestAnimationFrame(animate);
	render();
	TWEEN.update();

	if (SHOW_STATS) {
		stats.update();
	}
}


// Helper functions -----------------------------------------------------------------------

function generatePointGroup() {
	let group = new THREE.Group();

	// generate points
	const pointGeometry = new THREE.SphereGeometry(POINT_MIN_RADIUS, POINT_SEGMENTS, POINT_SEGMENTS);
	const pointObject = new THREE.Mesh(pointGeometry, greyMaterial);

	// randomly distribute NUM_POINTS number of pointObject in a sphere
	for (let a = 0; a < NUM_POINTS; a++) {
		let newPointObject = pointObject.clone();

		let x = Math.random() - 0.5;
		let y = Math.random() - 0.5;
		let z = Math.random() - 0.5;
		newPointObject.position.set(x, y, z);
		newPointObject.position.normalize();
		newPointObject.position.multiplyScalar(getRandomInt(CLOUD_INNER_RADIUS,CLOUD_OUTER_RADIUS));

		newPointObject.originalScale = Math.random() * POINT_SCALE_FACTOR + 1;
		newPointObject.scale.setScalar(newPointObject.originalScale);

		const rand = Math.random();
		if (rand < PURPLE_POINTS_RATIO) {
			newPointObject.material = purpleMaterial;
		}
		group.add(newPointObject);
	}

	return group;
}

// returns a THREE.Group containing lines that connect the points passed in passedPointGroup
function generateLineGroup(passedPointGroup) {

	let purplePoints = [];
	passedPointGroup.children.forEach(function(point) {
		if (point.material === purpleMaterial) {
			purplePoints.push(point);
		}
	});

	let lineList = {};
	purplePoints.forEach(function(point1) {
		let connectionsFound = 0;
		let point1ProximitySphere = new THREE.Sphere(point1.position, LINES_PROXIMITY_STEP);
		while (connectionsFound < MIN_NUM_CONNECTIONS) {
			purplePoints.forEach(function(point2) {
				if (point1 !== point2) {
					let selected = point1ProximitySphere.containsPoint(point2.position);
					if (selected) {
						let hash1 = parseInt(point1.uuid.slice(-6), 16);
						let hash2 = parseInt(point2.uuid.slice(-6), 16);
						let hashCode = hash1 + hash2;
						if (!lineList[hashCode]){
							let lineGeometry = new THREE.Geometry();
							lineGeometry.vertices.push(point1.position, point2.position);
							let newLine = new THREE.Line(lineGeometry, lineMaterial.clone());
							newLine.points = [ point1, point2 ];
							newLine.tween = new TWEEN.Tween(newLine.material).to({ opacity: 0 }, LINES_FADEOUT_TIMER);
							newLine.points.forEach(function(point) {
								point.tween = new TWEEN.Tween(point.scale).to({
									x: point.originalScale,
									y: point.originalScale,
									z: point.originalScale
								}, LINES_FADEOUT_TIMER);
							});
							lineList[hashCode] = newLine;
							connectionsFound++;
						}
					}
				}
			});
			point1ProximitySphere.radius += LINES_PROXIMITY_STEP;
		}
	});

	let group = new THREE.Group();
	for (key in lineList) {
		group.add(lineList[key]);
	}

	return group;
}

// On mousemove capture cursor position
function onMouseMove(event) {
	event.preventDefault();
	cursorPosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	cursorPosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

// On resize reset camera and renderer
function onWindowResize() {
	let width = window.innerWidth;
	let height = window.innerHeight;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

// return a random integer between min and max
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
