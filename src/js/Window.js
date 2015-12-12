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

import {dragStart, dragEnd} from './DragManager.js';

import {windowIndex, controlPanelIndex} from './zIndices.js';

const MIN_WIDTH = 300;
const MIN_HEIGHT = 300;

const ENTER = 13;

export default class Window extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			titleEdit: null,
		};

		this.resizeTimeout = null;
		this.moveStart = null;
		this.positionStart = null;
		this.resizeStart = null;
		this.sizeStart = null;
	}

	onMoveStart(event) {
		event.dataTransfer.setData('text/plain', '');
		dragStart(::this.onMove);
		this.moveStart = {x: event.clientX, y: event.clientY};
		this.positionStart = {left: this.props.left, top: this.props.top};
		(this.props.onDragStart || (() => undefined))();
	}

	onMove(event) {
		if (event.clientX === 0 && event.clientY === 0) {
			return;
		}
		this.props.onMove({
			left: this.positionStart.left + event.clientX - this.moveStart.x,
			top: this.positionStart.top + event.clientY - this.moveStart.y,
		});
		(this.props.onDrag || (() => undefined))(
			{x: event.clientX, y: event.clientY},
		);
 	}

	onMoveEnd(event) {
		dragEnd();
		(this.props.onDragEnd || (() => undefined))();
	}

	onResizeStart(event) {
		event.dataTransfer.setData('text/plain', '');
		dragStart(::this.onResize);
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

	onTitleEditStart(event) {
		this.setState(
			{titleEdit: this.props.title},
			() => this.refs.titleEditor.select(),
		);
	}

	onTitleEdit(event) {
		this.setState({titleEdit: event.target.value});
	}

	onTitleEditFinish(event) {
		if (event.keyCode === ENTER) {
			this.props.onTitleChange(this.state.titleEdit);
			this.setState(
				{titleEdit: null},
				this.props.onTitleChange.bind(null, this.state.titleEdit),
			);
		}
	}

	onClose(event) {
		this.props.onClose();
		event.stopPropagation();
	}

	render() {
		var windowStyle = {
			left: this.props.left+'px',
			top: this.props.top+'px',
			width: this.props.width+'px',
			height: this.props.height+'px',
			zIndex: windowIndex(this.props.zOrder),
		};

		var titleLabel = null;
		var titleEditor = null;
		var header = null;
		if (this.state.titleEdit === null) {
			titleLabel = <p className="map_window_title">{this.props.title}</p>;
			header = (
				<div
					className="map_window_header"
					style={{width: this.props.width+'px'}}
					draggable={true}
					onDragStart={::this.onMoveStart}
					onDragEnd={::this.onMoveEnd}
					onDoubleClick={::this.onTitleEditStart}
				/>
			);
		} else {
			titleEditor = (
				<input
					ref="titleEditor"
					className="map_window_title_editor"
					type="text"
					value={this.state.titleEdit}
					onChange={::this.onTitleEdit}
					onKeyUp={::this.onTitleEditFinish}
				/>
			);
		}

		var content = null;
		var controlPanel = null;
		if (React.Children.count(this.props.children) === 1) {
			content = this.props.children;
		} else {
			content = this.props.children[0];
			let panelStyle = {
				zIndex: controlPanelIndex(this.props.zOrder),
				left: (this.props.left + this.props.width - 10)+'px',
				top: (this.props.top + 20)+'px',
				height: (this.props.height - 40)+'px',
			};

			controlPanel = (
				<div
					className="map_window_control_panel"
					style={panelStyle}>
					{this.props.children[1]}
				</div>
			);
		}

		return (
			<div>
				<div
					className="map_window"
					style={windowStyle}
					onMouseDown={this.props.onFocus}>
					{titleLabel}
					{header}
					<div
						className="map_window_drag_handle"
						draggable={true}
						onDragStart={::this.onResizeStart}
						onDragEnd={dragEnd}
					/>
					{titleEditor}
					<a
						className="map_window_x"
						onClick={::this.onClose}>
						X
					</a>
					{content}
				</div>
				{controlPanel}
			</div>
		);
	}
}
Window.propTypes = {
	onFocus: React.PropTypes.func.isRequired,
	onMove: React.PropTypes.func.isRequired,
	onResize: React.PropTypes.func.isRequired,
	onClose: React.PropTypes.func.isRequired,
	onTitleChange: React.PropTypes.func.isRequired,
	onDragStart: React.PropTypes.func,
	onDrag: React.PropTypes.func,
	onDragEnd: React.PropTypes.func,
	zOrder: React.PropTypes.number.isRequired,
	left: React.PropTypes.number.isRequired,
	top: React.PropTypes.number.isRequired,
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	title: React.PropTypes.string.isRequired,
};
