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

export default class MainControls extends React.Component {
	render() {
		return (
			<div id="main_controls">
				<label>
					<input
						type="checkbox"
						checked={this.props.syncMovement}
						onChange={this.props.onSyncMovementChanged}
					/>
					Sync Movement
				</label>
				<br />
				<label>
					<input
						type="checkbox"
						checked={this.props.syncZoom}
						onChange={this.props.onSyncZoomChanged}
					/>
					Sync Zoom
				</label>
				<br />
				<input
					type="button"
					value="Add Map"
					onClick={this.props.onAddMap}
				/>
			</div>
		);
	}
}
MainControls.propTypes = {
	syncMovement: React.PropTypes.bool.isRequired,
	syncZoom: React.PropTypes.bool.isRequired,
	onSyncMovementChanged: React.PropTypes.func.isRequired,
	onSyncZoomChanged: React.PropTypes.func.isRequired,
	onAddMap: React.PropTypes.func.isRequired,
};
