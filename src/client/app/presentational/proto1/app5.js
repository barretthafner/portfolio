
const CAMERA_Z = 1500;

const SPHERE_ROTATION_SPEED = 0.07;
const SPHERE_INNER_RADIUS = 600;
const SPHERE_OUTER_RADIUS = 800;
const SPHERE_INITIAL_X = -500;

const NUM_POINTS = 3000;
const BLUE_POINTS_COLOR = 0x6251f3;
const BLUE_POINTS_RATIO = 0.35;

const FRUSTUM_REAR = 5000;

const FOG_START = CAMERA_Z + 1000;
const FOG_END = CAMERA_Z + SPHERE_OUTER_RADIUS * 1.4;


let stats;
let camera, scene;
let renderer;
let cloudGroup;


init();
animate();

// intialize function ------------------------------------------------------------

function init() {

	// grab window size and pixel ratio
	let width = window.innerWidth;
	let height = window.innerHeight;
	let pixelRatio = window.devicePixelRatio;

	// add resize listener
	window.addEventListener( 'resize', onWindowResize, false );

	//initialize cameras
	camera = new THREE.PerspectiveCamera( 60, width / height, 1, FRUSTUM_REAR );
	camera.position.z = CAMERA_Z;

	// initialize sceness
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x1e1e1e, FOG_START, FOG_END );

	// intialize renderer
	renderer = new THREE.WebGLRenderer({ antialiasing: true, alpha:true });
	renderer.setSize( width, height );
	renderer.setPixelRatio( pixelRatio );
	renderer.autoClear = false; // To allow render overlay on top of sprited sphere
	document.body.appendChild( renderer.domElement );


	// generate points

	// let textureLoader = new THREE.TextureLoader();
	// let map = textureLoader.load( "images/particle-square.gif" );
	// let material = new THREE.SpriteMaterial( { map: map, fog: true } );
	// let point = new THREE.Sprite( material );

	let geometry = new THREE.SphereGeometry(5, 10, 10);
	let material = new THREE.MeshBasicMaterial( {color: 0x838383} );
	let point = new THREE.Mesh( geometry, material );

	// var geometry = new THREE.CircleGeometry( 5, 32 );
	// var material = new THREE.MeshBasicMaterial( { color: 0x838383 } );
	// var point = new THREE.Mesh( geometry, material );

	// let geometry = new THREE.Geometry();
	// geometry.vertices.push( new THREE.Vector3(0,0,0) );
	// let material = new THREE.PointsMaterial({color: 0x838383, size: 10 });
	// let point = new THREE.Points( geometry, material );


	// initialize cloudGroup
	cloudGroup = generatePointCloud( point );
	cloudGroup.position.setX( SPHERE_INITIAL_X );
	scene.add( cloudGroup );

	stats = new Stats();
	document.body.appendChild( stats.dom );

}

// render function ------------------------------------------------------------------------

function render() {
	let time = Date.now() / 1000;
	// for ( let i = 0, l = cloudGroup.children.length; i < l; i ++ ) {
	// 	let sprite = cloudGroup.children[i];
	// 	let material = sprite.material;
	// 	let scale = 1; //Math.sin( time + sprite.position.x * 0.01 ) * 0.3 + 1.0;
	// 	let imageWidth = 1;
	// 	let imageHeight = 1;
	// 	if ( material.map && material.map.image && material.map.image.width ) {
	// 		imageWidth = material.map.image.width;
	// 		imageHeight = material.map.image.height;
	// 	}

	// 	sprite.scale.set( scale * imageWidth, scale * imageHeight, 1.0 );

	// }
	cloudGroup.rotation.x = time * SPHERE_ROTATION_SPEED;
	cloudGroup.rotation.y = time * SPHERE_ROTATION_SPEED;
	cloudGroup.rotation.z = time * SPHERE_ROTATION_SPEED;

	if (cloudGroup.position.x < 0) {
		cloudGroup.position.x += 2;
		cloudGroup.position.z -= 2;
		scene.fog.near += 2;
		scene.fog.far += 2;
	}

	renderer.clear();
	renderer.render( scene, camera );
}

function animate() {
	requestAnimationFrame( animate );
	render();
	stats.update();
}


// Helper functions -----------------------------------------------------------------------

function generatePointCloud(pointObject) {
	let group = new THREE.Group();
	for (let a = 0; a < NUM_POINTS; a++) {

		let newPointObject = pointObject.clone();
		let x = Math.random() - 0.5;
		let y = Math.random() - 0.5;
		let z = Math.random() - 0.5;
		newPointObject.position.set( x, y, z );
		newPointObject.position.normalize();
		newPointObject.position.multiplyScalar( getRandomInt(SPHERE_INNER_RADIUS,SPHERE_OUTER_RADIUS) );

		let blueMaterial = newPointObject.material.clone();
		blueMaterial.color.setHex(BLUE_POINTS_COLOR);
		const rand = Math.random();
		if(rand < BLUE_POINTS_RATIO) {
			newPointObject.material = blueMaterial;
		}
		group.add( newPointObject );
	}

	return group;
}

function onWindowResize() {
	let width = window.innerWidth;
	let height = window.innerHeight;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}



function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
