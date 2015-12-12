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

/**
 * This module is a little bit hacky, but necessary to make drag/drop
 * work in Firefox.  The problem is that if you use a drag event
 * handler on the element that's actually being dragged, Firefox
 * doesn't populate the clientX and clientY fields.  So to find out
 * where an element is being dragged at any given point in time, you
 * need to instead listen for the dragover event of an element higher
 * up in the DOM.
 *
 * So the solution here is to call dragStart when your drag begins,
 * and pass it a callback to use as your onDrag handler.  At script
 * initialization you'll need to register a dragover handler on some
 * top-level element that just points to the drag function, and it
 * will in turn call any currently registered drag callback.
 */

var dragCallback = null;

export function dragStart(callback) {
	dragCallback = callback;
}

export function drag(event) {
	if (dragCallback) {
		dragCallback(event);
	}
}

export function dragEnd() {
	dragCallback = null;
}
