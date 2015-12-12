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
	onSplitLinkClicked(mapID, event) {
		event.stopPropagation();
		this.props.onMapSplit(mapID);
	}

	render() {
		var {stack, allMaps} = this.props;

		var renderedMaps = [];
		var maps = [];
		for (let i in stack.maps) {
			maps.push({...stack.maps[i], ...allMaps[i]});
		}
		maps = maps.sort((a, b) => b.order - a.order);

		for (let i in maps) {
			let map = maps[i];
			let onChangeHandler = this.props.onMapOpacityChanged
				.bind(null, map.id);
			renderedMaps.push(
				<div key={map.id} className="map_window_control_panel_map">
					<span>{map.title}</span>
					<a
						href="#"
						onClick={this.onSplitLinkClicked.bind(this, map.id)}>
						<img src="box.png" 	alt="Split to separate window" />
					</a>
					<br />
					<label>
						Opacity
						<input
							type="range"
							value={map.opacity}
							min={0}
							max={1}
							step={0.05}
							onChange={onChangeHandler}
						/>
					</label>
				</div>
			);
		}

		return (
			<div className="map_window_control_panel_inner">
				<div className="map_window_control_panel_checkboxes">
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
				{renderedMaps}
			</div>
		);
	}
}
StackControlPanel.propTypes = {
	stack: stackPropType.isRequired,
	allMaps: allMapsPropType.isRequired,
	onSyncMovementChanged: React.PropTypes.func.isRequired,
	onSyncZoomChanged: React.PropTypes.func.isRequired,
	onMapOpacityChanged: React.PropTypes.func.isRequired,
	onMapSplit: React.PropTypes.func.isRequired,
};
