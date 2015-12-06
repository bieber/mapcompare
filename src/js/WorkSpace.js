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
import update from 'react-addons-update';

import MainControls from './MainControls.js';
import Map from './Map.js';
import Window from './Window.js';

import {highlightIndex} from './zIndices.js';

export default class WorkSpace extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.lastMapID = 0;

		this.state = {
			globalSyncMovement: false,
			globalSyncZoom: false,
			maps: [],
			dragMap: null,
			dragPosition: null,
		};
	}

	onGlobalSyncMovementChanged(event) {
		this.setState({globalSyncMovement: event.target.checked});
	}

	onGlobalSyncZoomChanged(event) {
		this.setState({globalSyncZoom: event.target.checked});
	}

	onAddMap() {
		var maps = update(this.state.maps, {});
		var newID = this.lastMapID++;
		maps[newID] = {
			id: newID,
			title: 'Map #'+(newID + 1),
			zOrder: newID,
			left: 50 + 20 * newID,
			top: 50 + 20 * newID,
			width: 400,
			height: 300,
			center: {lat: 0, lng: 0},
			zoom: 3,
		};
		this.setState({maps});
	}

	onMapFocused(mapID) {
		var delta = {};
		delta[mapID] = {$merge: {zOrder: this.lastMapID - 1}};
		for (let i in this.state.maps) {
			let map = this.state.maps[i];
			if (map.zOrder > this.state.maps[mapID].zOrder) {
				delta[i] = {$merge: {zOrder: map.zOrder - 1}};
			}
		}
		this.setState({maps: update(this.state.maps, delta)});
	}

	onMapPropsChanged(mapID, newPosition) {
		var delta = {};
		delta[mapID] = {$merge: newPosition};
		var maps = update(this.state.maps, delta);
		this.setState({maps});
	}

	onMapClosed(mapID) {
		var maps = update(this.state.maps, {});
		delete maps[mapID];
		this.setState({maps});
	}

	onMapTitleChanged(mapID, title) {
		var delta = {};
		delta[mapID] = {$merge: {title}};
		this.setState({maps: update(this.state.maps, delta)});
	}

	onMapZoomChanged(mapID, newZoom) {
		var delta = {};
		if (this.state.globalSyncZoom) {
			for (let i in this.state.maps) {
				delta[i] = {$merge: {zoom: newZoom}};
			}
		} else {
			delta[mapID] = {$merge: {zoom: newZoom}};
		}
		this.setState({maps: update(this.state.maps, delta)});
	}

	onMapCenterChanged(mapID, newCenter) {
		var delta = {};
		if (this.state.globalSyncMovement) {
			var selectedMap = this.state.maps[mapID];
			var dLat = newCenter.lat - selectedMap.center.lat;
			var dLng = newCenter.lng - selectedMap.center.lng;

			for (let i in this.state.maps) {
				let map = this.state.maps[i];
				delta[i] = {
					$merge: {
						center: {
							lat: map.center.lat + dLat,
							lng: map.center.lng + dLng,
						},
					},
				};
			}
		} else {
			delta[mapID] = {$merge: {center: newCenter}};
		}
		this.setState({maps: update(this.state.maps, delta)});
	}

	onMapDragStarted(mapID) {
		this.setState({dragMap: mapID});
	}

	onMapDragged(position) {
		this.setState({dragPosition: position});
	}

	onMapDragEnded() {
		this.setState({dragMap: null, dragPosition: null});
	}

	getHighlightedMap() {
		if (this.state.dragPosition === null) {
			return null;
		}

		var position = this.state.dragPosition;
		var matching = this.state.maps
			.filter(
				m => (
					m.id !== parseInt(this.state.dragMap) &&
					m.left <= position.x &&
					m.left + m.width >= position.x &&
					m.top <= position.y &&
					m.top + m.height >= position.y
				),
			).sort((a, b) => b.zOrder - a.zOrder);

		return matching.length === 0 ? null : matching[0];
	}

	render() {
		var renderedMaps = [];
		for (var i in this.state.maps) {
			let map = this.state.maps[i];
			let {
				center,
				zoom,
				width,
				height,
				...windowProps,
			} = this.state.maps[i];

			renderedMaps.push(
				<Window
					key={i}
					onFocus={this.onMapFocused.bind(this, i)}
					onMove={this.onMapPropsChanged.bind(this, i)}
					onResize={this.onMapPropsChanged.bind(this, i)}
					onClose={this.onMapClosed.bind(this, i)}
					onTitleChange={this.onMapTitleChanged.bind(this, i)}
					onDragStart={this.onMapDragStarted.bind(this, i)}
					onDrag={::this.onMapDragged}
					onDragEnd={::this.onMapDragEnded}
					{...{width, height}}
					{...windowProps}>
					<Map
						onCenterChange={this.onMapCenterChanged.bind(this, i)}
						onZoomChange={this.onMapZoomChanged.bind(this, i)}
						{...{width, height, center, zoom}}
					/>
				</Window>
			);
		}

		var highlightDiv = null;
		var highlightedMap = this.getHighlightedMap();
		if (highlightedMap !== null) {
			var highlightStyle = {
				zIndex: highlightIndex(highlightedMap.zOrder),
				top: highlightedMap.top,
				left: highlightedMap.left,
				width: (highlightedMap.width - 18)+'px',
				height: (highlightedMap.height - 18)+'px',
			};
			highlightDiv = (
				<div
					className="map_highlight"
					style={highlightStyle}
				/>
			);
		}

		return (
			<div className="container">
				<MainControls
					syncMovement={this.state.globalSyncMovement}
					syncZoom={this.state.globalSyncZoom}
					onSyncMovementChanged={::this.onGlobalSyncMovementChanged}
					onSyncZoomChanged={::this.onGlobalSyncZoomChanged}
					onAddMap={::this.onAddMap}
				/>
				{highlightDiv}
				{renderedMaps}
			</div>
		);
	}
}
