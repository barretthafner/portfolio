import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';\

import './welcome.scss';

class Welcome extends PureComponent {

	componentDidMount() {
		generateRandomKeyFrames(15, 16, 'random1');
		generateRandomKeyFrames(10, 10, 'random2');
		generateRandomClipFrames(200, 'random-clip-1');
	}

	componentWillUnmount() {
		removeAnimation('random1');
		removeAnimation('random2');
		removeAnimation('random-clip-1');
	}

	render() {
		return (
			<div className="wrapper">
				<div id="cyberpunk">
					<h1 className="text">WELCOME</h1>
					<h1 className="text">WELCOME</h1>
					<h1 className="text">WELCOME</h1>
					<h1 className="text">WELCOME</h1>
					<div className="thing-1"></div>
				</div>
			</div>
		);
	}
}


function getRandom (max) {
	let rn = Math.round(Math.random() * max);
	rn *= Math.random() > 0.5 ? -1 : 1;
	return rn;
}

function generateRandomKeyFrames(dis, len, name) {
	let keyframes = '';
	for (var i = 0; i < len; i++) {
		keyframes += `${(i / len) * 100}% {transform: translateX(${getRandom(dis)}px)}`;
	}

	let style = document.createElement('style');
	style.innerHTML = `@keyframes ${name} { ${keyframes} }`;
	style.id = name;

	document.body.appendChild(style);
}

function generateRandomClipFrames(len, name) {
	let keyframes = '';
	let size = 100;
	for (var i = 0; i < len; i++) {
		keyframes += `${(i / len) * 100}% { clip-path: inset(${getRandom(size)}% ${getRandom(size)}% ${getRandom(size)}% ${getRandom(size)}%) }`;
	}

	let style = document.createElement('style');
	style.innerHTML = `@keyframes ${name} { ${keyframes} }`;
	style.id = name;

	document.body.appendChild(style);
}

function removeAnimation(name) {
	document.body.removeChild(document.getElementById(name));
}

export default Welcome;
