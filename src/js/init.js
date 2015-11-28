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
import ReactDOM from 'react-dom';

import {GoogleMap, GoogleMapLoader} from 'react-google-maps';

import Config from '../config/config.js';

window.init = () => {
	var map = (
		<GoogleMap
			defaultZoom={3}
			center={{lat: 0, lng: 0}}
		/>
	);
	var container = <div className="container" />;
	
	ReactDOM.render(
		<GoogleMapLoader
			googleMapElement={map}
			containerElement={container}
		/>,
		document.getElementById('top_container'),
	);
}

export default function() {
	// This is a little bit hacky, but it's the cleanest way I could
	// come up with to keep the API key in its own JS file.  This will
	// just call the (sadly, globally defined) init function when the
	// Google Maps API is finished loading.
	var scriptTag = document.createElement('script');
	scriptTag.type = 'text/javascript';
	scriptTag.src = ''+
		'https://maps.googleapis.com/maps/api/js'+
		'?key='+Config.apiKey+
		'&callback=init';
	document.body.appendChild(scriptTag);
}
