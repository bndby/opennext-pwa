import { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_OPTIONS: PositionOptions = {};

const useWatchLocation = (options: PositionOptions = DEFAULT_OPTIONS) => {
    const [location, setLocation] =
        useState<
            Pick<
                GeolocationCoordinates,
                'latitude' | 'longitude' | 'altitude' | 'accuracy' | 'altitudeAccuracy' | 'heading' | 'speed'
            >
        >();
    const [error, setError] = useState('');
    const [isSupported, setIsSupported] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const locationWatchId = useRef<number | null>(null);

    // Стабильная ссылка на options — избегаем пересоздания watch на каждый рендер
    const optionsRef = useRef(options);

    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const handleSuccess = useCallback((pos: GeolocationPosition) => {
        const { latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed } = pos.coords;

        setLocation({
            latitude,
            longitude,
            altitude,
            accuracy,
            altitudeAccuracy,
            heading,
            speed,
        });
    }, []);

    const handleError = useCallback((error: GeolocationPositionError) => {
        setError(error.message);
    }, []);

    const cancelLocationWatch = useCallback(() => {
        const { geolocation } = navigator;

        if (locationWatchId.current != null && geolocation) {
            geolocation.clearWatch(locationWatchId.current);
            locationWatchId.current = null;
        }
    }, []);

    useEffect(() => {
        setIsClient(true);
        setIsSupported('geolocation' in navigator);

        const { geolocation } = navigator;

        if (!geolocation) {
            setError('Geolocation is not supported.');
            return;
        }

        locationWatchId.current = geolocation.watchPosition(handleSuccess, handleError, optionsRef.current);

        return cancelLocationWatch;
    }, [handleSuccess, handleError, cancelLocationWatch]);

    return { location, cancelLocationWatch, error, isSupported, isClient };
};

export default useWatchLocation;
