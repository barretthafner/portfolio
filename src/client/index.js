/**
 * Import polyfills
 */
import 'babel-polyfill';
import 'raf/polyfill';

/**
 * Import App name
 */
import { name } from '../../config';

/**
 * @lib Base styles
 */
import './style';

/**
 * Modernizr feature detection and Bowser browser sniffing
 */
import 'utils/browser';
import 'utils/modernizr';


/**
 * @lib React
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

/**
 * Redux store
 */
import { store } from './state/store';

/**
 * Top level app component
 */
import App from './app';

/**
 * Main render method
 * Renders App to the DOM, passes redux store and router history to App
 */
const render = () => {
	ReactDOM.render(
		<AppContainer>
			<Provider store={ store }>
				<App />
			</Provider>
		</AppContainer>, // react-hot-loader just passes children in production
		document.getElementById(name)
	);
};

/**
 * Event Listener to render app when DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', render);

/**
 * Hot Module Replacement API
 */
if (module.hot) module.hot.accept('./app', render);
