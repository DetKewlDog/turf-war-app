import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, LayersControl, LayerGroup  } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { booleanPointInPolygon } from '@turf/turf';
import 'leaflet/dist/leaflet.css';

import DraggableMarker from './components/DraggableMarker';

const MapComponent = () => {
	let [exploredArea, setExploredArea] = useState(JSON.parse(localStorage.getItem('area')) || []);
	let [position, setPosition] = useState([ 51.53, 0.25 ]);

	function handleNewPosition([latitude, longitude]) {
        const newPosition = new LatLng(latitude, longitude); // bottom right corner
		setPosition(newPosition);

        // Find the closest point on the existing shape
        let closestDistance = undefined;
		if (exploredArea.length !== 0) {
			for (let i = 0; i < exploredArea.length; i++) {
				const distance = newPosition.distanceTo(exploredArea[i]);
				if (closestDistance !== undefined && distance >= closestDistance) continue;
				closestDistance = distance;
			}
		}
		if (closestDistance <= 100) return;
		setExploredArea([...exploredArea, newPosition]);
		localStorage.setItem('area', JSON.stringify([...exploredArea, newPosition]));
	};

	const getGeoLocation = async () => {
		if (!navigator.geolocation) return position;
		return await navigator.geolocation.getCurrentPosition(
			coords => setPosition([coords.coords.latitude, coords.coords.longitude]),
			error => console.log(error.message)
		);
	}

	useEffect(() => {
		const interval = setInterval(() => {
			handleNewPosition(position);
			getGeoLocation();
		}, 5000);
        return () => clearInterval(interval);
	}, [position]);

    return (
		<>
			<MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }}>
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
				<LayersControl position="topright">
					<LayersControl.Overlay name="Turfs" checked>
						<LayerGroup>
							{exploredArea.map((point, index) => (
								<Circle key={index} pathOptions={{ color: 'purple' }} center={point} radius={200} stroke={true} />
							))}
						</LayerGroup>
					</LayersControl.Overlay>
					<LayersControl.Overlay name="Marker" checked>
						<DraggableMarker coords={position} setCoords={setPosition} callback={setPosition} />
					</LayersControl.Overlay>
				</LayersControl>
			</MapContainer>
		</>
    );
};

export default MapComponent;