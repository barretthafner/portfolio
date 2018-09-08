(function(){


	// Variables
	var WIDTH,
		HEIGHT,
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR,
		
		$container,
		
		renderer,
		camera,
		scene,
		
		particleCount,
		particles,
		particleSystem,
		pMaterial




	$(document).ready(function(){
		init();
	});


	function init(){
		setupRAF();
		setupEnvironment();
		setup3D();
		setupParticles();
		window.requestAnimFrame(update);
	}

	function setupRAF(){
		// @see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
		window.requestAnimFrame = (function(){
	    	return  window.requestAnimationFrame       || 
	    			window.webkitRequestAnimationFrame || 
	    			window.mozRequestAnimationFrame    || 
	             	window.oRequestAnimationFrame      || 
	              	window.msRequestAnimationFrame     || 
	              	function(/* function */ callback, /* DOMElement */ element){
	              		window.setTimeout(callback, 1000 / 60);
	              	};
	    })();
	}

	function setupEnvironment(){
		// set the scene size
		WIDTH = 1000;
		HEIGHT = 600;
		
		// set some camera attributes
		VIEW_ANGLE = 45;
		ASPECT = WIDTH / HEIGHT;
		NEAR = 0.1;
		FAR = 10000;
		
		// get the DOM element to attach to
		// - assume we've got jQuery to hand
		$container = $('#container');
	}

	function setup3D(){
		// create a WebGL renderer, camera
		// and a scene
		renderer = new THREE.WebGLRenderer();
		camera = new THREE.Camera(  VIEW_ANGLE,
		                                ASPECT,
		                                NEAR,
		                                FAR  );
		scene = new THREE.Scene();
		
		// the camera starts at 0,0,0 so pull it back
		camera.position.z = 300;
		
		// start the renderer - set the clear colour
		// to a full black
		renderer.setClearColor(new THREE.Color(0, 1));
		renderer.setSize(WIDTH, HEIGHT);
		
		// attach the render-supplied DOM element
		$container.append(renderer.domElement);
	}

	function setupParticles(){
		// create the particle variables
		particleCount = 1800;
		particles = new THREE.Geometry();
		pMaterial = new THREE.ParticleBasicMaterial({
			color: 0xFFFFFF,
			size: 20,
			map: THREE.ImageUtils.loadTexture(
				"images/particle.png"
			),
			blending: THREE.AdditiveBlending,
			transparent: true
		});
		
		// now create the individual particles
		for(var p = 0; p < particleCount; p++) {
		
			// create a particle with random
			// position values, -250 -> 250
			var pX = Math.random() * 500 - 250,
				pY = Math.random() * 500 - 250,
				pZ = Math.random() * 500 - 250,
			    particle = new THREE.Vertex(
					new THREE.Vector3(pX, pY, pZ)
				);
			// create a velocity vector
			particle.velocity = new THREE.Vector3(
				0,				// x
				-Math.random(),	// y
				0);				// z

			// add it to the geometry
			particles.vertices.push(particle);
		}
		
		// create the particle system
		particleSystem = new THREE.ParticleSystem(particles,pMaterial);
		
		particleSystem.sortParticles = true;
		
		// add it to the scene
		scene.addChild(particleSystem);
	}

	// animation loop
	function update() {
		
		// add some rotation to the system
		particleSystem.rotation.y += 0.01;
		
		var pCount = particleCount;
		while(pCount--) {
			// get the particle
			var particle = particles.vertices[pCount];
			
			// check if we need to reset
			if(particle.position.y < -200) {
				particle.position.y = 200;
				particle.velocity.y = 0;
			}
			
			// update the velocity
			particle.velocity.y -= Math.random() * .1;
			
			// and the position
			particle.position.addSelf(
				particle.velocity);
		}
		
		// flag to the particle system that we've
		// changed its vertices. This is the
		// dirty little secret.
		particleSystem.geometry.__dirtyVertices = true;
		
		renderer.render(scene, camera);
		
		// set up the next call
		window.requestAnimFrame(update);
	}

}());