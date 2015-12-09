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

import Map from './Map.js';

import {allMapsPropType, stackPropType} from './commonTypes.js';
import {windowIndex} from './zIndices.js';

export default class MapStack extends React.Component {
	render() {
		var {stack, allMaps} = this.props;

		var renderedMaps = [];
		var baseZIndex = windowIndex(stack.zOrder);
		for (var i in stack.maps) {
			let stackMap = stack.maps[i];
			let mapData = allMaps[i];
			var v = () => null;
			renderedMaps.push(
				<Map
					key={i}
					zIndex={baseZIndex + stackMap.order + 1}
					opacity={stackMap.opacity}
					onCenterChange={this.props.onMapCenterChange.bind(null, i)}
					onZoomChange={this.props.onMapZoomChange.bind(null, i)}
					{...mapData}
				/>
			);
		}
		return <div>{renderedMaps}</div>;
	}
}
MapStack.propTypes = {
	stack: stackPropType.isRequired,
	allMaps: allMapsPropType.isRequired,
	onMapCenterChange: React.PropTypes.func.isRequired,
	onMapZoomChange: React.PropTypes.func.isRequired,
};
