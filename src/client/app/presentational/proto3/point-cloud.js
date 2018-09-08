/**
 * @overview Point cloud
 */
import { CLOUD_X_ROTATION_SPEED, CLOUD_Y_ROTATION_SPEED, CLOUD_Z_ROTATION_SPEED } from './constants';
import Point from './point';



/**
 * @class
 * Point cloud class, extends THREE.Points (point group)
 */
export default class PointCloud extends THREE.Points {

	/**
	 * @constructor
	 *
	 * @param {number} count - Number of points
	 * @param {THREE.Material} material - Fabric of points
	 */
	constructor(count, material, rotationSpeedX, rotationSpeedY, rotationSpeedZ) {

		let geometry = new THREE.Geometry();

		// Create `count` number of points at random positions in the cloud
		for (let i = 0; i < count; i++) {
			geometry.vertices.push(new Point(geometry));
		}
		console.log(rotationSpeedX)

		super(geometry, material);

		this._rotateTween = new TWEEN.Tween(this.rotation)
			.to({
				x: '-' + rotationSpeedX,
				y: '-' + rotationSpeedY,
				z: '-' + rotationSpeedZ
			})
			.repeat(Infinity);
	}

	/**
	 * @method
	 * Start rotation
	 */
	startRotation() {
		this._rotateTween.start();
		return this._rotateTween;
	}

	/**
	 * @method
	 * Stop rotation
	 */
	stopRotation() {
		this._rotateTween.stop();
		return this._rotateTween;
	}

	/**
	 * @method
	 * Start initial animation
	 *
	 * @param {function} callback
	 */
	startInitialAnimation(callback) {
		let count = 0;
		let vertices = this.geometry.vertices;
		vertices.forEach(point => {
			point.runInitialAnimation(() => {
				count++;
				if (count === vertices.length && callback) {
					callback();
				}
			});
		});
	}
}
