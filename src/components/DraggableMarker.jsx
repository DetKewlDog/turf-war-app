import { useState, useRef, useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';

export default function DraggableMarker({ coords, callback }) {
    const [position, setPosition] = useState(coords);
    const markerRef = useRef(null);
    const eventHandlers = useMemo(() => ({
        dragend() {
            const marker = markerRef.current;
            if (marker === null) return;
            const newPosition = Object.values(marker.getLatLng());
            setPosition(newPosition);
            callback === undefined || callback(newPosition);
        }
    }), []);

    return (
        <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef}>
            <Popup>{position.map(x => x.toFixed(3)).join(', ')}</Popup>
        </Marker>
    );
}