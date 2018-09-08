// Selection.js

import CONST from './Constants';



export class SelectionSphere extends THREE.Mesh {

	constructor() {
		const geometry = new THREE.SphereGeometry(CONST.SELECTION_SPHERE_RADIUS, 32, 32);
		const material = new THREE.MeshBasicMaterial({
			color: 0xF66717,
			depthWrite: false,
			transparent: true,
			opacity: CONST.HELPER_MESH_OPACITY
		});
		super(geometry, material);
		this.visible = false;

		this.sphere = new THREE.Sphere();

	}

	clear() {
		this.sphere.set({x: 0, y: 0, z: 0}, 0);
		this.position.copy(this.sphere.center);
		this.visible = false;
	}

	set(position) {
		this.position.copy(position);
		this.visible = true;
		this.sphere.set(position, CONST.SELECTION_SPHERE_RADIUS);
	}

	containsPoint(vector) {
		return this.sphere.containsPoint(vector);
	}
}




export class SelectionShell extends THREE.Mesh {

	constructor() {
		const geometry = new THREE.SphereGeometry(CONST.SELECTION_SHELL_RADIUS, 32, 32);
		const material = new THREE.MeshBasicMaterial({
			color: 0x6698CB,
			transparent: true,
			depthWrite: false,
			opacity: CONST.HELPER_MESH_OPACITY,
			// side: THREE.DoubleSide // for selecting either side of the selectionShell
		});

		super(geometry, material);
	}
}