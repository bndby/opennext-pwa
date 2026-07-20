'use client';

import useWatchLocation from '@/hooks/useWatchLocation';
import { MapView } from './MapView';
import { useEffect } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';

function hasCoord(value: number | null | undefined): value is number {
    return value != null && !Number.isNaN(value);
}

export default function WatchLocation() {
    const { location, error, cancelLocationWatch, isSupported, isClient } = useWatchLocation();

    useEffect(() => {
        return () => {
            cancelLocationWatch();
        };
    }, [cancelLocationWatch]);

    if (!isClient) {
        return <div>Загрузка...</div>;
    }

    if (!isSupported) {
        return <div>Geolocation не поддерживается в вашем браузере</div>;
    }

    if (error && !location) {
        return <div>Ошибка (Error): {error}</div>;
    }

    if (!location) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {hasCoord(location.latitude) && <p>Широта (Latitude): {location.latitude}</p>}
            {hasCoord(location.longitude) && <p>Долгота (Longitude): {location.longitude}</p>}
            {hasCoord(location.altitude) && <p>Высота (Altitude): {location.altitude}</p>}
            {hasCoord(location.accuracy) && <p>Точность (Accuracy): {location.accuracy}</p>}
            {hasCoord(location.altitudeAccuracy) && (
                <p>Высотная точность (Altitude Accuracy): {location.altitudeAccuracy}</p>
            )}
            {hasCoord(location.heading) && <p>Направление (Heading): {location.heading}</p>}
            {hasCoord(location.speed) && <p>Скорость (Speed): {location.speed}</p>}
            {error && <p>Ошибка (Error): {error}</p>}

            <ErrorBoundary title="Ошибка карты">
                <MapView latitude={location.latitude} longitude={location.longitude} />
            </ErrorBoundary>
        </div>
    );
}
