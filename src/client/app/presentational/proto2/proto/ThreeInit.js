// ThreeInit.js

import CONST from './Constants';

// grab window size and pixel ratio
const width = window.innerWidth;
const height = window.innerHeight;
const pixelRatio = window.devicePixelRatio;

const container = document.createElement('div');
document.body.appendChild(container);

let stats = null;

// intialize stats object
if (CONST.SHOW_STATS) {
	stats = new Stats();
	document.body.appendChild(stats.dom);
}

//initialize cameras
let camera = new THREE.PerspectiveCamera(60, width / height, 1, CONST.FRUSTUM_REAR);
camera.position.setZ(CONST.CLOUD_Z);

// initialize sceness
let scene = new THREE.Scene();
scene.fog = new THREE.Fog( CONST.BACKGROUND_COLOR, CONST.FOG_START, CONST.FOG_END );

// intialize renderer
let renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true });
renderer.setSize(width, height);
renderer.setPixelRatio(pixelRatio);
renderer.setClearColor(CONST.BACKGROUND_COLOR);

document.body.appendChild(renderer.domElement);


// add event listeners
window.addEventListener('resize', onWindowResize, false);

// On resize reset camera and renderer
function onWindowResize() {
	let width = window.innerWidth;
	let height = window.innerHeight;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

export { camera, scene, renderer, stats }