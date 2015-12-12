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
import MapStack from './MapStack.js';
import StackControlPanel from './StackControlPanel.js';
import Window from './Window.js';

import {highlightIndex} from './zIndices.js';

export default class WorkSpace extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.lastMapID = 0;
		this.lastStackID = 0;

		this.state = {
			globalSyncMovement: false,
			globalSyncZoom: false,
			maps: {},
			stacks: {},
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

	onStackSyncMovementChanged(stackID, event) {
		var delta = {};
		delta[stackID] = {$merge: {syncMovement: event.target.checked}};
		this.setState({stacks: update(this.state.stacks, delta)});
	}

	onStackSyncZoomChanged(stackID, event) {
		var delta = {};
		delta[stackID] = {$merge: {syncZoom: event.target.checked}};
		this.setState({stacks: update(this.state.stacks, delta)});
	}

	onAddMap() {
		var delta = {};
		var newID = this.lastMapID++;
		delta[newID] = {
			$set: {
				id: newID,
				stackID: null,
				title: 'Map #'+(newID + 1),
				zOrder: this.objectCount(),
				left: 50 + 20 * newID,
				top: 50 + 20 * newID,
				width: 400,
				height: 300,
				center: {lat: 0, lng: 0},
				zoom: 3,
			},
		};
		this.setState({maps: update(this.state.maps, delta)});
	}

	onMapFocused(mapID) {
		var delta = {maps: {}, stacks: {}};
		delta.maps[mapID] = {$merge: {zOrder: this.objectCount() - 1}};
		for (let i in this.state.maps) {
			let map = this.state.maps[i];
			if (map.zOrder > this.state.maps[mapID].zOrder) {
				delta.maps[i] = {$merge: {zOrder: map.zOrder - 1}};
			}
		}
		for (let i in this.state.stacks) {
			let stack = this.state.stacks[i];
			if (stack.zOrder > this.state.maps[mapID].zOrder) {
				delta.stacks[i] = {$merge: {zOrder: stack.zOrder - 1}};
			}
		}
		this.setState(update(this.state, delta));
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
		var selectedMap = this.state.maps[mapID];
		var stackZoomSynced = selectedMap.stackID !== null &&
			this.state.stacks[selectedMap.stackID].syncZoom;

		if (this.state.globalSyncZoom) {
			for (let i in this.state.maps) {
				delta[i] = {$merge: {zoom: newZoom}};
			}
		} else if (stackZoomSynced) {
			for (let i in this.state.stacks[selectedMap.stackID].maps) {
				delta[i] = {$merge: {zoom: newZoom}};
			}
		} else {
			delta[mapID] = {$merge: {zoom: newZoom}};
		}
		this.setState({maps: update(this.state.maps, delta)});
	}

	onMapCenterChanged(mapID, newCenter) {
		var delta = {};
		var selectedMap = this.state.maps[mapID];
		var stackMovementSynced = selectedMap.stackID !== null &&
			this.state.stacks[selectedMap.stackID].syncMovement;

		var dLat = newCenter.lat - selectedMap.center.lat;
		var dLng = newCenter.lng - selectedMap.center.lng;

		if (this.state.globalSyncMovement) {
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
		} else if (stackMovementSynced) {
			for (let i in this.state.stacks[selectedMap.stackID].maps) {
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

	onMapOpacityChanged(mapID, event) {
		var map = this.state.maps[mapID];
		var delta = {};
		delta[map.stackID] = {maps: {}};
		delta[map.stackID].maps[mapID] = {
			$merge: {opacity: parseFloat(event.target.value)},
		};
		this.setState({stacks: update(this.state.stacks, delta)});
	}

	onMapMovedUp(mapID) {
		var map = this.state.maps[mapID];
		var stack = this.state.stacks[map.stackID];
		var delta = {};
		delta[stack.id] = {maps: {}};

		delta[stack.id].maps[mapID] = {
			$merge: {order: stack.maps[mapID].order + 1},
		};
		for (let i in stack.maps) {
			let stackMap = stack.maps[i];
			if (stackMap.order === stack.maps[mapID].order + 1) {
				delta[stack.id].maps[i] = {
					$merge: {order: stack.maps[mapID].order},
				};
			}
		}

		this.setState({stacks: update(this.state.stacks, delta)});
	}

	onMapMovedDown(mapID) {
		var map = this.state.maps[mapID];
		var stack = this.state.stacks[map.stackID];
		var delta = {};
		delta[stack.id] = {maps: {}};

		delta[stack.id].maps[mapID] = {
			$merge: {order: stack.maps[mapID].order - 1},
		};
		for (let i in stack.maps) {
			let stackMap = stack.maps[i];
			if (stackMap.order === stack.maps[mapID].order - 1) {
				delta[stack.id].maps[i] = {
					$merge: {order: stack.maps[mapID].order},
				};
			}
		}

		this.setState({stacks: update(this.state.stacks, delta)});
	}

	onMapSplit(mapID, event) {
		var targetMap = this.state.maps[mapID];
		var stackID = targetMap.stackID;
		var stack = this.state.stacks[targetMap.stackID];

		var mapsDelta = {};
		var stacksDelta = {};
		mapsDelta[mapID] = {
			$merge: {
				stackID: null,
				left: targetMap.left + 10,
				top: targetMap.top + 10,
				zOrder: this.objectCount() - 1,
			},
		};

		for (let i in this.state.maps) {
			let map = this.state.maps[i];
			if (map.zOrder > targetMap.zOrder) {
				mapsDelta[i] = {$merge: {zOrder: map.zOrder - 1}};
			}
		}
		for (let i in this.state.stacks) {
			let stack = this.state.stacks[i];
			if (stack.zOrder > targetMap.zOrder) {
				stacksDelta[i] = {$merge: {zOrder: stack.zOrder - 1}};
			}
		}

		stacksDelta[stackID].maps = {};
		for (let i in stack.maps) {
			let map = stack.maps[i];
			if (map.order > stack.maps[mapID].order) {
				stacksDelta[stackID].maps[i] = {$merge: {order: map.order - 1}};
			}
		}

		var stacks = update(this.state.stacks, stacksDelta);
		if (Object.keys(stack.maps).length === 2) {
			for (let i in stack.maps) {
				if (i !== mapID.toString()) {
					mapsDelta[i] = {$merge: {stackID: null}};
				}
			}
			delete stacks[stackID];
		} else {
			delete stacks[stackID].maps[mapID];
		}

		var maps = update(this.state.maps, mapsDelta);
		this.setState({maps, stacks});
	}

	onMapDragStarted(mapID) {
		this.setState({dragMap: mapID});
	}

	onMapDragged(position) {
		this.setState({dragPosition: position});
	}

	onMapDragEnded() {
		var delta = {
			dragMap: {$set: null},
			dragPosition: {$set: null},
		};
		var highlighted = this.getHighlightedMap();

		if (highlighted !== null) {
			delta.maps = {};
			delta.stacks = {};

			if (highlighted.stackID !== null) {
				let stackID = highlighted.stackID;
				let stack = this.state.stacks[stackID];
				delta.maps[this.state.dragMap] = {
					$merge: {
						stackID,
						left: stack.left,
						top: stack.top,
						width: stack.width,
						height: stack.height,
					},
				};

				let maps = this.state.stacks[stackID].maps;
				delta.stacks[stackID] = {};
				delta.stacks[stackID].maps = {};
				delta.stacks[stackID].maps[this.state.dragMap] = {
					$set: {
						order: Object.keys(maps).length,
						opacity: 1.,
					},
				};
			} else {
				let newID = this.lastStackID++;

				let mapsInfo = {};
				mapsInfo[this.state.dragMap] = {
					order: 1,
					opacity: 1.,
				};
				mapsInfo[highlighted.id] = {
					order: 0,
					opacity: 1.,
				};
				delta.stacks[newID] = {
					$set: {
						id: newID,
						title: 'Stack #'+(newID + 1),
						zOrder: this.objectCount(),
						left: highlighted.left,
						top: highlighted.top,
						width: highlighted.width,
						height: highlighted.height,
						maps: mapsInfo,
						syncMovement: false,
						syncZoom: false,
					},
				};

				delta.maps[highlighted.id] = {$merge: {stackID: newID}};
				delta.maps[this.state.dragMap] = {
					$merge: {
						stackID: newID,
						left: highlighted.left,
						top: highlighted.top,
						width: highlighted.width,
						height: highlighted.height,
					},
				};
			}
		}

		this.setState(update(this.state, delta));
	}

	onStackFocused(stackID) {
		var delta = {maps: {}, stacks: {}};
		delta.stacks[stackID] = {$merge: {zOrder: this.objectCount() - 1}};
		for (let i in this.state.maps) {
			let map = this.state.maps[i];
			if (map.zOrder > this.state.stacks[stackID].zOrder) {
				delta.maps[i] = {$merge: {zOrder: map.zOrder - 1}};
			}
		}
		for (let i in this.state.stacks) {
			let stack = this.state.stacks[i];
			if (stack.zOrder > this.state.stacks[stackID].zOrder) {
				delta.stacks[i] = {$merge: {zOrder: stack.zOrder - 1}};
			}
		}
		this.setState(update(this.state, delta));
	}

	onStackPropsChanged(stackID, newProps) {
		var delta = {maps: {}, stacks: {}};
		delta.stacks[stackID] = {$merge: newProps};
		for (let i in this.state.stacks[stackID].maps) {
			delta.maps[i] = {$merge: newProps};
		}
		this.setState(update(this.state, delta));
	}

	onStackClosed(stackID) {
		var maps = update(this.state.maps, {});
		var stacks = update(this.state.stacks, {});

		for (let i in this.state.stacks[stackID].maps) {
			delete maps[i];
		}
		delete stacks[stackID];

		this.setState({maps, stacks});
	}

	onStackTitleChanged(stackID, title) {
		var delta = {};
		delta[stackID] = {$merge: {title}};
		this.setState({stacks: update(this.state.stacks, delta)});
	}

	objectCount() {
		return Object.keys(this.state.maps).length
			+ Object.keys(this.state.stacks).length;
	}

	getHighlightedMap() {
		if (this.state.dragPosition === null) {
			return null;
		}

		var position = this.state.dragPosition;
		var maps = [];
		for (let i in this.state.maps) {
			maps.push(this.state.maps[i]);
		}
		var matching = maps
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
		for (let i in this.state.maps) {
			let map = this.state.maps[i];
			if (map.stackID !== null) {
				continue;
			}

			let {
				center,
				zoom,
				width,
				height,
				...windowProps,
			} = this.state.maps[i];

			renderedMaps.push(
				<Window
					key={'map-'+i}
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

		for (let i in this.state.stacks) {
			let stack = this.state.stacks[i];
			let {width, height, maps, ...windowProps} = stack;

			let syncMovementHandler = this.onStackSyncMovementChanged
				.bind(this, i);
			let syncZoomHandler = this.onStackSyncZoomChanged
				.bind(this, i);
			renderedMaps.push(
				<Window
					key={"stack-"+i}
					onFocus={this.onStackFocused.bind(this, i)}
					onMove={this.onStackPropsChanged.bind(this, i)}
					onResize={this.onStackPropsChanged.bind(this, i)}
					onClose={this.onStackClosed.bind(this, i)}
					onTitleChange={this.onStackTitleChanged.bind(this, i)}
					{...{width, height}}
					{...windowProps}>
					<MapStack
						stack={stack}
						allMaps={this.state.maps}
						onMapCenterChange={::this.onMapCenterChanged}
						onMapZoomChange={::this.onMapZoomChanged}
					/>
					<StackControlPanel
						stack={stack}
						allMaps={this.state.maps}
						onSyncMovementChanged={syncMovementHandler}
						onSyncZoomChanged={syncZoomHandler}
						onMapOpacityChanged={::this.onMapOpacityChanged}
						onMapMovedUp={::this.onMapMovedUp}
						onMapMovedDown={::this.onMapMovedDown}
						onMapSplit={::this.onMapSplit}
					/>
				</Window>
			);
		}

		var highlightDiv = null;
		var highlightedMap = this.getHighlightedMap();
		if (highlightedMap !== null) {
			let zOrder = highlightedMap.zOrder;
			if (highlightedMap.stackID !== null) {
				zOrder = this.state.stacks[highlightedMap.stackID].zOrder;
			}

			var highlightStyle = {
				zIndex: highlightIndex(zOrder),
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
