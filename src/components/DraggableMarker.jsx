import { useState, useRef, useMemo, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';

export default function DraggableMarker({ coords, setCoords, callback }) {
    const markerRef = useRef(null);
    const eventHandlers = useMemo(() => ({
        dragend() {
            const marker = markerRef.current;
            if (marker === null) return;
            const newPosition = Object.values(marker.getLatLng());
            setCoords(newPosition);
            callback === undefined || callback(newPosition);
        }
    }), []);

    useEffect(() => {

    }, [coords]);

    return (
        <Marker draggable={false} eventHandlers={eventHandlers} position={coords} ref={markerRef}>
            <Popup>{`${coords[0]}, ${coords[1]}`}</Popup>
        </Marker>
    );
}