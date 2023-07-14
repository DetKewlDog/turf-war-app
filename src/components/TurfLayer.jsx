import { Circle, LayerGroup } from 'react-leaflet';

export default function TurfLayer({ area, color }) {
    return (
        <LayerGroup>
            {area.map((point, index) => (
                <Circle key={index}
                    pathOptions={{ color: color }}
                    center={point}
                    radius={100} />
            ))}
        </LayerGroup>
    );
}