//Vertex.js
import CONST from './Constants';

export default class Vertex extends THREE.Vector3 {

	constructor(parent) {
		super((Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5));
		this.setLength(getRandomInt(CONST.CLOUD_INNER_RADIUS, CONST.CLOUD_OUTER_RADIUS));

		let home = new THREE.Vector3();
		home.copy(this);
		this.home = home;
		this.target = null;
		this.setLength(0);

		this.state = 'home'; // 'returning', 'leaving'
		this.parent = parent;

		let vertex = this;
		let distance = 900;

		let theta = THREE.Math.randFloatSpread(360);
		let phi = THREE.Math.randFloatSpread(360);

		let targetInitX = (distance + Math.floor((Math.random() + 1)  * 40)) * Math.sin(theta) * Math.cos(phi);
		let targetInitY = (distance + Math.floor((Math.random() + 1) * 40)) * Math.sin(theta) * Math.sin(phi);
		let targetInitZ = getRandomInt(-100, 200);


		this._initialTween = {

			start: function() {
				this.tween1.start();
			},

			tween1: new TWEEN.Tween(vertex)
				.delay(2000)
				.to({
					x: targetInitX,
					y: targetInitY,
					z: targetInitZ,
				}, 1500)
				.onUpdate(() => {
					vertex.parent.verticesNeedUpdate = true;
				})
				.easing(TWEEN.Easing.Quintic.Out),

			tween2: new TWEEN.Tween(vertex)
				.delay(1500 * Math.random())
				.to({
					x: vertex.home.x,
					y: vertex.home.y,
					z: vertex.home.z,
				}, 6500)
				.easing(TWEEN.Easing.Quadratic.InOut)
				.onUpdate(() => {
					vertex.parent.verticesNeedUpdate = true;
				}),
		}

	}

	move() {
		if (this.target && this.target !== this.home) {
			let targetLength = this.target.length();
			let length = this.length();
			let distanceFromTarget = targetLength - length;
			if (distanceFromTarget > 1) {
				this.setLength(length + 7.5);
			}

		} else {
			let targetLength = this.target.length();
			let length = this.length();
			let distanceFromTarget = length - targetLength;

			if (distanceFromTarget > 1) {
				this.setLength(length - 1);
			}
		}
		this.parent.verticesNeedUpdate = true;
	}

	runInitialAnimation(cb) {

		this._initialTween.tween1.chain(this._initialTween.tween2);
		this._initialTween.tween2.onComplete(cb);

		this._initialTween.start();
	}

}

// return a random integer between min and max
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}