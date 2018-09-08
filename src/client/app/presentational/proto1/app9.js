
/*
  Cannot fade poitns currently. Instead use ShaderMaterial to be able to fade
  http://jsfiddle.net/8mrH7/195/
*/


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var bgColor = 0x272727;

var mouseX;
var mouseY;
var mouseZ = 100;

var scene = new THREE.Scene();

scene.fog = new THREE.Fog( 0x272727, 100, 400 );

var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.set(0,0,250);

var renderer = new THREE.WebGLRenderer({
  antialias:true
});
renderer.setClearColor( bgColor );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


var whiteParticle = 2500;
var coloredParticles = 750;

var distance = 100;    
var geometry = new THREE.Geometry();
var particles;

var distance2 = 100;
var geometry2 = new THREE.Geometry();
var particle2;

createWhiteSphere();
createBlueSphere();
initStats();
initEvents();

setTimeout(function(){
  update();
}.bind(this), 2000)


var originalState = true;

function initEvents(){
  renderer.domElement.addEventListener('click', function(e){
    
    originalState = !originalState;
    doSomethingWithBlueParticle();

    
  }.bind(this))
}

function doSomethingWithBlueParticle(){
  var l = geometry2.vertices.length;
  
  for(var i=0;i<l;i++){
    var vertex = geometry2.vertices[i];
    var theta = THREE.Math.randFloatSpread(360); 
    var phi = THREE.Math.randFloatSpread(360); 

    if(originalState){

      var nVertex = new THREE.Vector3();
      nVertex.x = vertex.x;
      nVertex.y = vertex.y;
      nVertex.z = vertex.z;
      nVertex.setLength(getRandomInt(90,110));

      vertex.moveToX = nVertex.x;
      vertex.moveToY = nVertex.y;
      vertex.moveToZ = nVertex.z;

      // vertex.moveToX = (distance2 * 1.05 + 1 + Math.floor(Math.random() * 20)) * Math.sin(theta) * Math.cos(phi);
      // vertex.moveToY = (distance2 * 1.05 + 1 + Math.floor(Math.random() * 20)) * Math.sin(theta) * Math.sin(phi);
      // vertex.moveToZ = (distance2  *1.05 + 1 + Math.floor(Math.random() * 20)) * Math.cos(theta);
    }else{
      vertex.moveToX = vertex.targetX;
      vertex.moveToY = vertex.targetY;
      vertex.moveToZ = vertex.targetZ;
    }

    // createjs.Tween.get(vertex, {loop:false, override:true})
    //     .to({x: vertex.moveToX, y: vertex.moveToY, z: vertex.moveToZ, }, Math.random() * 500 + 1200, createjs.Ease.quintInOut);
  }

  var l2 = geometry.vertices.length;
  for(var j=0;j<l2; j++){
    var vertex2 = geometry.vertices[j];
    var theta = THREE.Math.randFloatSpread(360); 
    var phi = THREE.Math.randFloatSpread(360); 
    
    if(originalState){
      var nVertex = new THREE.Vector3();
      nVertex.x = vertex2.x;
      nVertex.y = vertex2.y;
      nVertex.z = vertex2.z;
      nVertex.setLength(getRandomInt(250,280));

      vertex2.moveToX = nVertex.x;
      vertex2.moveToY = nVertex.y;
      vertex2.moveToZ = nVertex.z;


      // vertex2.moveToX = (distance * 0.1 + 1 + Math.floor(Math.random() * 20)) * Math.sin(theta) * Math.cos(phi);
      // vertex2.moveToY = (distance * 0.1  + 1 + Math.floor(Math.random() * 20)) * Math.sin(theta) * Math.sin(phi);
      // vertex2.moveToZ = (distance * 0.1 + 1 + Math.floor(Math.random() * 20)) * Math.cos(theta);
    }else{
      vertex2.moveToX = vertex2.targetX;
      vertex2.moveToY = vertex2.targetY;
      vertex2.moveToZ = vertex2.targetZ;
    }

    createjs.Tween.get(vertex2, {loop:false, override:true})
        .to({x: vertex2.moveToX, y: vertex2.moveToY, z: vertex2.moveToZ, }, Math.random() * 1000 + 1000, createjs.Ease.quintOut);
  }

  // if(originalState){
  //   createjs.Tween.get(camera.position, {loop:false, override:true})
  //       .to({z:190 }, 5000, createjs.Ease.quintInOut);
  // }else{
  //   createjs.Tween.get(camera.position, {loop:false, override:true})
  //       .to({z:250 }, 5000, createjs.Ease.quintInOut);
  // }

}

//initRayCaster();

function createWhiteSphere(){

  for (var i = 0; i < whiteParticle; i++) {

      var vertex = new THREE.Vector3();

      var theta = THREE.Math.randFloatSpread(360); 
      var phi = THREE.Math.randFloatSpread(360); 

        vertex.x = 0;
        vertex.y = 0;
        vertex.z = 0;

        vertex.targetInitX = ((distance * 2) + 1 + Math.floor(Math.random() * 20)) * Math.sin(theta) * Math.cos(phi);
        vertex.targetInitY = ((distance * 2) + 1 + Math.floor(Math.random() * 20)) * Math.sin(theta) * Math.sin(phi);
        vertex.targetInitZ = getRandomInt(-100,200)

        vertex.targetX = (distance + 1 + Math.floor(Math.random() * 20)) * Math.sin(theta) * Math.cos(phi);
        vertex.targetY = (distance + 1 + Math.floor(Math.random() * 20)) * Math.sin(theta) * Math.sin(phi);
        vertex.targetZ = (distance + 1 + Math.floor(Math.random() * 20)) * Math.cos(theta);
     

      createjs.Tween.get(vertex, {loop:false, override:true})
          .wait(2000)
          .to({x: vertex.targetInitX, y: vertex.targetInitY, z: vertex.targetInitZ, }, 2000, createjs.Ease.quintOut)
          .wait(1500 * Math.random())
          .to({x: vertex.targetX, y: vertex.targetY, z: vertex.targetZ, }, 4500, createjs.Ease.quintInOut);

      geometry.vertices.push(vertex);
  }
  particles = new THREE.Points(geometry, new THREE.PointsMaterial({color: 0x666666, size:0.75}));
  particles.boundingSphere = 50;

  scene.add(particles);
    
}

function createBlueSphere(){
  for (var i = 0; i < coloredParticles; i++) {

      var vertex = new THREE.Vector3();

      var theta = THREE.Math.randFloatSpread(360); 
      var phi = THREE.Math.randFloatSpread(360); 

        vertex.x = 0;
        vertex.y = 0;
        vertex.z = 0;

        vertex.targetInitX = ((distance * 2) + 1 + Math.floor(Math.random() * 20)) * Math.sin(theta) * Math.cos(phi);
        vertex.targetInitY = ((distance * 2) + 1 + Math.floor(Math.random() * 20)) * Math.sin(theta) * Math.sin(phi);
        vertex.targetInitZ = getRandomInt(-100,200)

        vertex.targetX = (distance + 1 + Math.floor(Math.random() * 20)) * Math.sin(theta) * Math.cos(phi);
        vertex.targetY = (distance + 1 + Math.floor(Math.random() * 20)) * Math.sin(theta) * Math.sin(phi);
        vertex.targetZ = (distance + 1 + Math.floor(Math.random() * 20)) * Math.cos(theta);

        createjs.Tween.get(vertex, {loop:false, override:true})
          .wait(2000)
          .to({x: vertex.targetInitX, y: vertex.targetInitY, z: vertex.targetInitZ, }, 2000, createjs.Ease.quintOut)
          .wait(1500 * Math.random())
          .to({x: vertex.targetX, y: vertex.targetY, z: vertex.targetZ, }, 5000, createjs.Ease.quintInOut);
   
      geometry2.vertices.push(vertex);


  }
  particles2 = new THREE.Points(geometry2, new THREE.PointsMaterial({color: 0x412de7, size:0.75}));
  particles2.boundingSphere = 50;

  scene.add(particles2);
}

// var raycaster, mouseVector, intersects;

// function initRayCaster(){
//   raycaster = new THREE.Raycaster();
//   mouseVector = new THREE.Vector2();
//   document.addEventListener( 'mousemove', onMouseMove, false );
// }

// function onMouseMove( e ) { 

//     mouseVector.x = ( e.clientX / window.innerWidth ) * 2 - 1;
//     mouseVector.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    
//     //intersects = raycaster.intersectObjects(particles2.geometry.vertices, true);
//     //var intersects = raycaster.intersectObjects(particles2.geometry.vertices);
//     //console.log(intersects);
    
//     // if (intersects.length>0){
//     //     intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
//     // }

// }

var stats;

function initStats(){
  stats = new Stats();
  //stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );
}

function update() {

  stats.begin();

  var rotateX = particles.rotation.x + 0.0005;
  var rotateY = particles.rotation.y + 0.0001;
  var rotateZ = particles.rotation.z + 0.001;
  particles.rotation.set( rotateX, rotateY, rotateZ );

  var rotateX = particles2.rotation.x + 0.0005;
  var rotateY = particles2.rotation.y + 0.0001;
  var rotateZ = particles2.rotation.z + 0.001;
  particles2.rotation.set( rotateX, rotateY, rotateZ );

  particles.geometry.verticesNeedUpdate = true;
  particles2.geometry.verticesNeedUpdate = true;

  camera.lookAt(scene.position);
  renderer.render(scene,camera);

  stats.end();

  requestAnimationFrame(update);
}