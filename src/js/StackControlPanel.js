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

import {allMapsPropType, stackPropType} from './commonTypes.js';

export default class StackControlPanel extends React.Component {
	render() {
		var {stack, allMaps} = this.props;

		return (
			<div className="map_window_control_panel_inner">
				<label>
					<input
						type="checkbox"
						checked={stack.syncMovement}
						onChange={this.props.onSyncMovementChanged}
					/>
					Sync Movement
				</label>
				<br />
				<label>
					<input
						type="checkbox"
						checked={stack.syncZoom}
						onChange={this.props.onSyncZoomChanged}
					/>
					Sync Zoom
				</label>
			</div>
		);
	}
}
StackControlPanel.propTypes = {
	stack: stackPropType.isRequired,
	allMaps: allMapsPropType.isRequired,
	onSyncMovementChanged: React.PropTypes.func.isRequired,
	onSyncZoomChanged: React.PropTypes.func.isRequired,
};
