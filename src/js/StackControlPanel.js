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
	constructor(props, context) {
		super(props, context);

		this.state = {
			dragMap: null,
		};
	}

	onSplitLinkClicked(mapID, event) {
		event.stopPropagation();
		this.props.onMapSplit(mapID);
	}

	onDragStart(mapID) {
		this.setState({dragMap: mapID});
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

			let upArrow = null;
			let downArrow = null;
			if (map.order !== 0) {
				downArrow = (
					<a
						className="map_window_control_panel_arrow_down_button"
						href="#"
						onClick={this.props.onMapMovedDown.bind(this, map.id)}>
						<img src="arrow_down.png" alt="Move map down" />
					</a>
				);
			}
			if (map.order < Object.keys(maps).length - 1) {
				upArrow = (
					<a
						className="map_window_control_panel_arrow_up_button"
						href="#"
						onClick={this.props.onMapMovedUp.bind(this, map.id)}>
						<img src="arrow_up.png" alt="Move map up" />
					</a>
				);
			}

			renderedMaps.push(
				<div key={map.id} className="map_window_control_panel_map">
					<span>{map.title}</span>
					{downArrow}
					{upArrow}
					<a
						className="map_window_control_panel_split_button"
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
	onMapMovedUp: React.PropTypes.func.isRequired,
	onMapMovedDown: React.PropTypes.func.isRequired,
	onMapSplit: React.PropTypes.func.isRequired,
};
