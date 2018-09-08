/**
 * @overview
 * Point (former Vertex) - a single point
 */
import { CLOUD_INNER_RADIUS, CLOUD_OUTER_RADIUS, POINT_FRICTION_AWAY, POINT_FRICTION_HOME, POINT_FORCE } from './constants';



/**
 * @function
 * Return a random integer between min and max
 */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}



/**
 * @class
 */
export default class Point extends THREE.Vector3 {

	/**
	 * @constructor
	 *
	 * @param {THREE.Geometry} parent
	 */
	constructor(parent) {
		super((Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5));
		this.setLength(getRandomInt(CLOUD_INNER_RADIUS, CLOUD_OUTER_RADIUS));

		let home = new THREE.Vector3();
		home.copy(this);
		this.home = home;
		this.target = home;
		this.setLength(0);

		this.velocity = 0;

		this.parent = parent;

		this.setupInitialAnimation();
	}

	/**
	 * @method
	 * Setup initial animation tweens. Weird math magic by @colmandesilva.
	 */
	setupInitialAnimation() {
		let vertex = this;

		// TODO: @colman to provide more explanation of the math in this section
		let distance = 900;

		let theta = THREE.Math.randFloatSpread(360);
		let phi = THREE.Math.randFloatSpread(360);

		let targetInitX = (distance + Math.floor((Math.random() + 1)  * 40)) * Math.sin(theta) * Math.cos(phi);
		let targetInitY = (distance + Math.floor((Math.random() + 1) * 40)) * Math.sin(theta) * Math.sin(phi);
		let targetInitZ = getRandomInt(-100, 200);

		this.initialAnimation = [
			// First tween
			new TWEEN.Tween(vertex)
				.to({
					x: targetInitX,
					y: targetInitY,
					z: targetInitZ
				}, 1500)
				.onUpdate(() => {
					vertex.parent.verticesNeedUpdate = true;
				})
				.easing(TWEEN.Easing.Exponential.Out),

			// Second tween
			new TWEEN.Tween(vertex)
				.delay(500 * Math.random())
				.to({
					x: vertex.home.x,
					y: vertex.home.y,
					z: vertex.home.z
				}, 4000)
				.easing(TWEEN.Easing.Quartic.InOut)
				.onUpdate(() => {
					vertex.parent.verticesNeedUpdate = true;
				})
		];
	}

	/**
	 * @method
	 * Move point. TODO: @barrett to provide more explanation of how length works in this method
	 */
	move() {
		let targetLength = this.target.length();
		let length = this.length();
		let distance = targetLength - length;
		let friction = this.target === this.home ? POINT_FRICTION_HOME : POINT_FRICTION_AWAY ;

		if (Math.abs(distance) > 0) {
			this.velocity += distance * POINT_FORCE;
			this.velocity *= 1 - friction;
			this.setLength(length + this.velocity);
		}

		// Let the parent geometry know that it needs to update its points (vertices)
		this.parent.verticesNeedUpdate = true;
	}

	/**
	 * @method
	 * Run initial animation
	 *
	 * @param {function} callback
	 */
	runInitialAnimation(callback) {
		for (let i = 0; i < this.initialAnimation.length; i++) {
			let tween = this.initialAnimation[i],
				nextTween = this.initialAnimation[i + 1];

			if (nextTween) {
				tween.chain(nextTween);
			} else {
				tween.onComplete(callback);
			}
		}

		this.initialAnimation[0].start();
	}

	/**
	 * @method
	 * Set point target. Will set target to home position if passed argument is `undefined`.
	 *
	 * @param {Vector3} target
	 */
	setTarget(target = this.home) {
		this.target = target;
	}
}
