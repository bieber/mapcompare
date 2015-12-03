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

import {GoogleMapLoader, GoogleMap, Marker, SearchBox} from 'react-google-maps';

const MIN_WIDTH = 100;
const MIN_HEIGHT = 100;
const MS_BETWEEN_RESIZES = 250;
const MS_GEOMETRY_DELAY = 50;

const searchBoxStyle = {
	marginTop: '10px',
	marginRight: '10px',
};

export default class Map extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {markers: []};

		this.resizeTimeout = null;
		this.moveStart = null;
		this.positionStart = null;
		this.resizeStart = null;
		this.sizeStart = null;
	}

	componentDidUpdate(prevProps, prevState) {
		var widthChanged = prevProps.width !== this.props.width;
		var heightChanged = prevProps.height !== this.props.height;
		if (widthChanged || heightChanged) {
			// Debouncing this a little keeps the UI responsive on resize
			if (this.resizeTimeout === null) {
				this.resizeTimeout = setTimeout(
					() => {
						google.maps.event.trigger(
							this.refs.map.props.map,
							'resize',
						);
						this.resizeTimeout = null;
					},
					MS_BETWEEN_RESIZES,
				);
			}
		}
	}

	onMoveStart(event) {
		this.moveStart = {x: event.clientX, y: event.clientY};
		this.positionStart = {left: this.props.left, top: this.props.top};
	}

	onMove(event) {
		if (event.clientX === 0 && event.clientY === 0) {
			return;
		}
		this.props.onMove({
			left: this.positionStart.left + event.clientX - this.moveStart.x,
			top: this.positionStart.top + event.clientY - this.moveStart.y,
		});
 	}

	onResizeStart(event) {
		this.resizeStart = {x: event.clientX, y: event.clientY};
		this.sizeStart = {width: this.props.width, height: this.props.height};
	}

	onResize(event) {
		if (event.clientX === 0 && event.clientY === 0) {
			return;
		}
		var dw = event.clientX - this.resizeStart.x;
		var dh = event.clientY - this.resizeStart.y;
		this.props.onResize({
			width: Math.max(this.sizeStart.width + dw, MIN_WIDTH),
			height: Math.max(this.sizeStart.height + dh, MIN_HEIGHT),
		});
	}

	onClose(event) {
		this.props.onClose();
		event.stopPropagation();
	}


	onGeometryChanged() {
		var center = this.refs.map.getCenter();
		var zoom = this.refs.map.getZoom();
		this.props.onCenterChange({
			lat: center.lat(),
			lng: center.lng(),
		});
		this.props.onZoomChange(zoom);
	}

	onCenterChanged() {
		// This is kind of a weird hack.  The problem I was running
		// into is that using a GoogleMap in controlled mode doesn't
		// really mesh with Google's event model.  When you update the
		// map by double-clicking a point or scrolling the mouse, two
		// things happen: first you get a center changed event, then
		// you get a zoom changed event.  The problem is that if you
		// have this set up as a controlled component, your reaction
		// to the center changed event will trigger a rerender and
		// you'll never receive the zoom event.  So I've sidestepped
		// this a little bit by delayig the check and then just
		// simultaneously checking the center and zoom level, which
		// seems to work and doesn't disrupt the UI with a minimal
		// delay length.
		setTimeout(this.onGeometryChanged.bind(this), MS_GEOMETRY_DELAY);
	}

	onPlacesChanged() {
		var markers = this.refs.searchBox.getPlaces().map(
			(p, i, ps) => ({
				lat: p.geometry.location.lat(),
				lng: p.geometry.location.lng(),
			}),
		);
		if (markers.length > 0) {
			this.props.onCenterChange(markers[0]);
		}
		this.setState({markers});
	}

	render() {
		var markers = [];
		for (let i = 0; i < this.state.markers.length; i++) {
			let location = this.state.markers[i];
			markers.push(
				<Marker
					key={i}
					position={location}
					onClick={this.props.onCenterChange.bind(null, location)}
				/>,
			);
		}

		var searchBoxBounds = null;
		var existingMap = this.refs.map;
		if (existingMap) {
			searchBoxBounds = existingMap.getBounds();
		}
		var mapContainer = <div className="map_container" />;
		var map = (
			<GoogleMap
				ref="map"
				center={this.props.center}
				zoom={this.props.zoom}
				onCenterChanged={this.onCenterChanged.bind(this)}
				onZoomChanged={this.onGeometryChanged.bind(this)}>
				<SearchBox
					ref="searchBox"
					style={searchBoxStyle}
					controlPosition={google.maps.ControlPosition.TOP_RIGHT}
					bounds={searchBoxBounds}
					onPlacesChanged={this.onPlacesChanged.bind(this)}
				/>
				{markers}
			</GoogleMap>
		);

		var windowStyle = {
			left: this.props.left+'px',
			top: this.props.top+'px',
			width: this.props.width+'px',
			height: this.props.height+'px',
			zIndex: this.props.zOrder * 10 + 50,
		};

		var windowHeaderStyle = {
			width: this.props.width+'px',
		};

		return (
			<div
				className="map_window"
				style={windowStyle}
				onMouseDown={this.props.onFocus}>
				<div
					className="map_window_header"
					style={{width: this.props.width+'px'}}
					draggable={true}
					onDragStart={this.onMoveStart.bind(this)}
					onDrag={this.onMove.bind(this)}
				/>
				<div
					className="map_window_drag_handle"
					draggable={true}
					onDragStart={this.onResizeStart.bind(this)}
					onDrag={this.onResize.bind(this)}
				/>
				<a
					className="map_window_x"
					onClick={this.onClose.bind(this)}>
					X
				</a>
				<GoogleMapLoader
					containerElement={mapContainer}
					googleMapElement={map}
				/>
			</div>
		);
	}
}
Map.propTypes = {
	onFocus: React.PropTypes.func.isRequired,
	onMove: React.PropTypes.func.isRequired,
	onResize: React.PropTypes.func.isRequired,
	onClose: React.PropTypes.func.isRequired,
	onCenterChange: React.PropTypes.func.isRequired,
	onZoomChange: React.PropTypes.func.isRequired,
	id: React.PropTypes.number.isRequired,
	zOrder: React.PropTypes.number.isRequired,
	left: React.PropTypes.number.isRequired,
	top: React.PropTypes.number.isRequired,
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	center: React.PropTypes.shape({
		lat: React.PropTypes.number.isRequired,
		lng: React.PropTypes.number.isRequired,
	}),
	zoom: React.PropTypes.number.isRequired,
};
