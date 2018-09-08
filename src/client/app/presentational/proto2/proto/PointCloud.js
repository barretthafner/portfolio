// PointCloud.js
import CONST from './Constants';
import Vertex from './Vertex';


export default class PointCloud extends THREE.Points {

	constructor(count, material) {

		let geometry = new THREE.Geometry();

		// create 'count' number of points at random positions in the cloud
		for (let i = 0; i < count; i++) {
			geometry.vertices.push(new Vertex(geometry));
		}

		super(geometry, material);

		// add rotation animation
		this.rotateAnimation = {

			start: function() {
				if (CONST.CLOUD_X_ROTATION_SPEED > 0) {
					this.rotateX.start();
				}
				if (CONST.CLOUD_Y_ROTATION_SPEED > 0) {
					this.rotateY.start();
				}
				if (CONST.CLOUD_Z_ROTATION_SPEED > 0) {
					this.rotateZ.start();
				}
			},

			stop: function() {
				this.rotateX.stop();
				this.rotateY.stop();
				this.rotateZ.stop();
			},

			rotateX: new TWEEN.Tween(this.rotation)
				.to({ x: "-" + CONST.CLOUD_X_ROTATION_SPEED})
				.repeat(Infinity),
			rotateY: new TWEEN.Tween(this.rotation)
				.to({ y: "-" + CONST.CLOUD_Y_ROTATION_SPEED})
				.repeat(Infinity),
			rotateZ: new TWEEN.Tween(this.rotation)
				.to({ z: "-" + CONST.CLOUD_Z_ROTATION_SPEED})
				.repeat(Infinity),

		}
	}

	startInitialAnimation(callback) {
		let count = 0;
		let vertices = this.geometry.vertices;
		vertices.forEach(vertex => {
			vertex.runInitialAnimation(() => {
				count++;
				if (count === vertices.length) {
					callback();
				}
			});
		});
	}
}
