import { useRef, useMemo, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const icon = new L.Icon({
    iconUrl: 'https://cdn.discordapp.com/attachments/801426473059614730/1131177633904865390/current-loc.svg',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
});

export default function DraggableMarker({ coords, setCoords }) {
    const markerRef = useRef(null);
    const eventHandlers = useMemo(() => ({
        dragend() {
            const marker = markerRef.current;
            if (marker === null) return;
            const newPosition = Object.values(marker.getLatLng());
            setCoords(newPosition);;
        }
    }), []);

    useEffect(() => {

    }, [coords]);

    return (
        <Marker draggable={false} eventHandlers={eventHandlers} position={coords} ref={markerRef} icon={icon}>
            <Popup>{`${coords[0]}, ${coords[1]}`}</Popup>
        </Marker>
    );
}