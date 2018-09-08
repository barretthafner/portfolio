/**
 * @overview state
 * Basic THREE initialization. Sets up the scene, camera, etc.
 */
import { SHOW_STATS, FRUSTUM_REAR, CLOUD_Z, BACKGROUND_COLOR, FOG_START, FOG_END } from './constants';


/**
 * @const
 * Grab window size and pixel ratio
 */
const width = window.innerWidth;
const height = window.innerHeight;
const pixelRatio = window.devicePixelRatio;

const container = document.createElement('div');
document.body.appendChild(container);

let stats = null;



// Intialize stats object
if (SHOW_STATS) {
	stats = new Stats();
	document.body.appendChild(stats.dom);
}



// Initialize cameras
let camera = new THREE.PerspectiveCamera(60, width / height, 1, FRUSTUM_REAR);
camera.position.setZ(CLOUD_Z);



// Initialize scene
let scene = new THREE.Scene();
scene.fog = new THREE.Fog(BACKGROUND_COLOR, FOG_START, FOG_END);


// Intialize renderer
let renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true });
renderer.setSize(width, height);
renderer.setPixelRatio(pixelRatio);
renderer.setClearColor(BACKGROUND_COLOR);

document.body.appendChild(renderer.domElement);



// Add event listeners
window.addEventListener('resize', onWindowResize, false);



// On resize reset camera and renderer
function onWindowResize() {
	let width = window.innerWidth;
	let height = window.innerHeight;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}



export { camera, scene, renderer, stats };
