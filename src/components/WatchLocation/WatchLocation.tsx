'use client';

import useWatchLocation from '@/hooks/useWatchLocation';
import MapView from './MapView';

export default function WatchLocation() {
    const { location, error } = useWatchLocation();

    if (!location) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <p>Latitude: {location?.latitude}</p>
            <p>Longitude: {location?.longitude}</p>
            <p>Error: {error}</p>

            <MapView latitude={location.latitude} longitude={location.longitude} />
        </div>
    );
}
