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

const BASE = 50;
const INCREMENT = 10;

export function windowIndex(zOrder) {
	return zOrder * INCREMENT + BASE;
}

export function highlightIndex(zOrder) {
	return zOrder * INCREMENT + BASE + 1;
}

export function controlPanelIndex(zOrder) {
	return zOrder * INCREMENT + BASE - 1;
}
