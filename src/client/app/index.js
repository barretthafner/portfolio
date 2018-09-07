
/**
 * React App
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


import Welcome from './presentational/welcome';

class App extends React.Component {

	static propTypes = {
		showLoader: PropTypes.bool
	}

	render() {
		const { showLoader } = this.props;
		return (
			<div className="app-container">
				{ showLoader ? <Welcome /> : null }
				<span>Hello World</span>
			</div>
		);
	}
}

export default connect(state => {
	return {
		showLoader: state.ui.showLoader
	};
})(App);
