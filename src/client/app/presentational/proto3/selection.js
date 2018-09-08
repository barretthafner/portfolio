/**
 * @overview
 * Selection sphere and shell.
 */

import { SELECTION_SPHERE_RADIUS, HELPER_MESH_OPACITY, SELECTION_SHELL_RADIUS, SELECTION_SHELL_COLOR, SELECTION_SPHERE_COLOR } from './constants';



/**
 * @class
 * Sphere created where the raycaster hits the shell
 */
export class SelectionSphere extends THREE.Mesh {

	/**
	 * @constructor
	 */
	constructor() {
		const geometry = new THREE.SphereGeometry(SELECTION_SPHERE_RADIUS, 32, 32);
		const material = new THREE.MeshBasicMaterial({
			color: SELECTION_SPHERE_COLOR,
			depthWrite: false,
			transparent: true,
			opacity: HELPER_MESH_OPACITY
		});
		super(geometry, material);
		this.visible = false;

		this.sphere = new THREE.Sphere();
	}

	/**
	 * @method
	 * Remove sphere
	 */
	clear() {
		this.sphere.set({ x: 0, y: 0, z: 0 }, 0);
		this.position.copy(this.sphere.center);
		this.visible = false;
	}

	/**
	 * @method
	 * Set sphere position
	 *
	 * @param {THREE.Vector3} vector
	 */
	set(vector) {
		this.position.copy(vector);
		this.visible = HELPER_MESH_OPACITY > 0;
		this.sphere.set(vector, SELECTION_SPHERE_RADIUS);
	}

	/**
	 * @method
	 * Set sphere position
	 *
	 * @param {THREE.Vector3} vector
	 */
	containsPoint(vector) {
		return this.sphere.containsPoint(vector);
	}
}



/**
 * @class
 * Shell surrounding the cloud used to figure out where the raycaster hits the cloud
 */
export class SelectionShell extends THREE.Mesh {

	/**
	 * @constructor
	 */
	constructor() {
		const geometry = new THREE.SphereGeometry(SELECTION_SHELL_RADIUS, 32, 32);
		const material = new THREE.MeshBasicMaterial({
			color: SELECTION_SHELL_COLOR,
			transparent: true,
			depthWrite: false,
			opacity: HELPER_MESH_OPACITY,
			side: THREE.DoubleSide // for selecting either side of the selectionShell
		});

		super(geometry, material);
	}
}
