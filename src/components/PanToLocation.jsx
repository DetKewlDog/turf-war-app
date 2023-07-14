import { useMapEvents } from 'react-leaflet';
import '../index.css';

const ALIGN_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
};
let useAnim = false, zoom = undefined;

export default function PanToLocation({ align, setPosition }) {
    const map = useMapEvents({
        locationfound(e) {
            setPosition(Object.values(e.latlng));
            useAnim ? map.flyTo(e.latlng, zoom) : map.setView(e.latlng, zoom);
            useAnim = true;
        },
    });

    if (!useAnim) {
        zoom = map.getZoom();
        map.locate();
    }

    const positionClass = (align && ALIGN_CLASSES[align]) || ALIGN_CLASSES.topright;
    return (
        <div className={positionClass}>
            <div className="leaflet-control leaflet-bar">
                <a className="fas fa-crosshairs" onClick={() => map.locate()}></a>
            </div>
        </div>
    );
}