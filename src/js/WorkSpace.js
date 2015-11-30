/*
 * Copyright 2015, Robert Bieber
 *
 * This file is part of mapcompare.
 *
 * mapcompare is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * mapcompare is distributed in the hope that it will be useful,
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with mapcompare.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';

import MainControls from './MainControls.js';

export default class WorkSpace extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			globalSyncMovement: false,
			globalSyncZoom: false,
		};
	}

	onGlobalSyncMovementChanged(event) {
		this.setState({globalSyncMovement: event.target.checked});
	}

	onGlobalSyncZoomChanged(event) {
		this.setState({globalSyncZoom: event.target.checked});
	}

	onAddMap() {
		console.log('Added map');
	}

	render() {
		var globalSyncMovementHandler = this.onGlobalSyncMovementChanged
			.bind(this);
		var globalSyncZoomHandler = this.onGlobalSyncZoomChanged
			.bind(this);

		return (
			<div className="container">
				<MainControls
					syncMovement={this.state.globalSyncMovement}
					syncZoom={this.state.globalSyncZoom}
					onSyncMovementChanged={globalSyncMovementHandler}
					onSyncZoomChanged={globalSyncZoomHandler}
					onAddMap={this.onAddMap.bind(this)}
				/>
			</div>
		);
	}
}
