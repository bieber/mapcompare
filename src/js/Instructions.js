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

export default class Instructions extends React.Component {
	render() {
		return (
			<div id="instructions">
				<p>
					mapcompare lets you, well, compare maps.  The box at the
					upper right corner of the screen is the global control
					panel.  If you click "Add Map," it will put a new window
					on the screen that displays a map.  If you click the
					"Sync Movement" checkbox it will make every map on the
					screen move when you move one of them.  If you check the
					"Sync Zoom" checkbox, it will make every map on the screen
					zoom when you zoom.  With these global controls, you can
					compare maps at equivalent scales side by side.  You can
					also move maps around on the screen by dragging their
					window titles, and resize them by dragging from their
					lower right corner.  You can rename them by double-clicking
					their titles.
				</p>
				<p>
					If you drag one map over top of another and release, you
					can combine them into a stack.  In this mode, both maps
					are displayed on top of each other.  You can change their
					ordering by clicking the up and down arrows, or remove
					a map from a stack by clicking the rectangle button in
					the corner of that map's control panel section.  Each
					stack has its own local sync zoom and sync movement
					controls, which you can use to sync map adjustments just
					within that stack.  Each map in the stack also has an
					opacity slider that you can adjust to see one map overlayed
					on top of others.
				</p>
				<p>
					mapcompare is copyright 2015, Robert Bieber.  You can see
					its source code at{' '}
					<a href="http://www.github.com/bieber/mapcompare">
						github.com/bieber/mapcompare
					</a>, and you can see the rest of my projects at{' '}
					<a href="http://www.biebersprojects.com">
						biebersprojects.com
					</a>.  Big thanks to tomchentw for the{' '}
					<a href="http://www.github.com/tomchentw/react-google-maps">
						react-google-maps
					</a> library that powers the Google maps views.
				</p>
			</div>
		);
	}
}
