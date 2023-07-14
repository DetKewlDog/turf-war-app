import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import DraggableMarker from './components/DraggableMarker';
import PanToLocation from './components/PanToLocation';
import TurfLayer from './components/TurfLayer';

export default function App() {
	let [exploredArea, setExploredArea] = useState(JSON.parse(localStorage.getItem('area')) || []);
	let [position, setPosition] = useState([0, 0]);

	function handleNewPosition([latitude, longitude]) {
		const newPosition = new LatLng(latitude, longitude);
		setPosition(newPosition);

        let closestDistance = undefined;
		if (exploredArea.length !== 0) {
			for (let i = 0; i < exploredArea.length; i++) {
				const distance = newPosition.distanceTo(exploredArea[i]);
				if (closestDistance !== undefined && distance >= closestDistance) continue;
				closestDistance = distance;
			}
		}
		if (closestDistance <= 12.5) return;
		setExploredArea([...exploredArea, newPosition]);
		localStorage.setItem('area', JSON.stringify([...exploredArea, newPosition]));
	};

	const getGeoLocation = () => {
		if (!navigator.geolocation) return position;
		return navigator.geolocation.getCurrentPosition(
			coords => setPosition([coords.coords.latitude, coords.coords.longitude]),
			error => console.log(error.message)
		);
	}

	useEffect(() => {
		const interval = setInterval(() => {
			if (position[0] && position[1]) handleNewPosition(position);
			getGeoLocation();
		}, 1000);
        return () => clearInterval(interval);
	}, [position]);

    return (
		<MapContainer center={position} zoom={14} style={{ minHeight: '90vh' }}>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

			<PanToLocation align="bottomleft" setPosition={setPosition} />

			<LayersControl position="topright">
				<LayersControl.Overlay name="Turfs" checked>
					<TurfLayer area={exploredArea} color='purple' />
				</LayersControl.Overlay>

				<LayersControl.Overlay name="Marker" checked>
					<DraggableMarker coords={position} setCoords={setPosition} />
				</LayersControl.Overlay>
			</LayersControl>
		</MapContainer>
    );
};