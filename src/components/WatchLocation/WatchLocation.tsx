'use client';

import useWatchLocation from '@/hooks/useWatchLocation';
import { MapView } from './MapView';
import { useEffect } from 'react';

export default function WatchLocation() {
    const { location, error, cancelLocationWatch } = useWatchLocation();

    useEffect(() => {
        return () => {
            cancelLocationWatch();
        };
    }, [cancelLocationWatch]);

    if (!location) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {location?.latitude && <p>Широта (Latitude): {location?.latitude}</p>}
            {location?.longitude && <p>Долгота (Longitude): {location?.longitude}</p>}
            {location?.altitude && <p>Высота (Altitude): {location?.altitude}</p>}
            {location?.accuracy && <p>Точность (Accuracy): {location?.accuracy}</p>}
            {location?.altitudeAccuracy && <p>Высотная точность (Altitude Accuracy): {location?.altitudeAccuracy}</p>}
            {location?.heading && <p>Направление (Heading): {location?.heading}</p>}
            {location?.speed && <p>Скорость (Speed): {location?.speed}</p>}
            {error && <p>Ошибка (Error): {error}</p>}

            <MapView latitude={location.latitude} longitude={location.longitude} />
        </div>
    );
}
