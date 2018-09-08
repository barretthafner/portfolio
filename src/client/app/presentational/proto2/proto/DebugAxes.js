// DebugAxes.js



// deprecated.........



export default class DebugAxes extends THREE.Group {

	constructor(axisLength){
		super();
		this.add(createAxis(v(-axisLength, 0, 0), v(axisLength, 0, 0), 0xFF0000));
		this.add(createAxis(v(0, -axisLength, 0), v(0, axisLength, 0), 0x00FF00));
		this.add(createAxis(v(0, 0, -axisLength), v(0, 0, axisLength), 0x0000FF));
	}
}

function v(x,y,z){
  return new THREE.Vector3(x,y,z);
}

function createAxis(p1, p2, color){
  let lineGeometry = new THREE.Geometry();
  let lineMat = new THREE.LineBasicMaterial({color: color, linewidth: 1});
  lineGeometry.vertices.push(p1, p2);
  return new THREE.Line(lineGeometry, lineMat);
}