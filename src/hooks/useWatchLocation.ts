import { useState, useEffect, useRef, useCallback } from 'react';

const useWatchLocation = (options = {}) => {
    // store location in state
    const [location, setLocation] =
        useState<
            Pick<
                GeolocationCoordinates,
                'latitude' | 'longitude' | 'altitude' | 'accuracy' | 'altitudeAccuracy' | 'heading' | 'speed'
            >
        >();
    // store error message in state
    const [error, setError] = useState('');
    const [isSupported, setIsSupported] = useState(false);
    const [isClient, setIsClient] = useState(false);
    // save the returned id from the geolocation's `watchPosition` to be able to cancel the watch instance
    const locationWatchId = useRef<number | null>(null);

    // Success handler for geolocation's `watchPosition` method
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

    // Error handler for geolocation's `watchPosition` method
    const handleError = useCallback((error: GeolocationPositionError) => {
        setError(error.message);
    }, []);

    // Clears the watch instance based on the saved watch id
    const cancelLocationWatch = useCallback(() => {
        const { geolocation } = navigator;

        if (locationWatchId.current && geolocation) {
            geolocation.clearWatch(locationWatchId.current);
        }
    }, []);

    useEffect(() => {
        setIsClient(true);
        setIsSupported('geolocation' in navigator);

        const { geolocation } = navigator;

        // If the geolocation is not defined in the used browser we handle it as an error
        if (!geolocation) {
            setError('Geolocation is not supported.');
            return;
        }

        // Start to watch the location with the Geolocation API
        locationWatchId.current = geolocation.watchPosition(handleSuccess, handleError, options);

        // Clear the location watch instance when React unmounts the used component
        return cancelLocationWatch;
    }, [options, handleSuccess, handleError, cancelLocationWatch]);

    return { location, cancelLocationWatch, error, isSupported, isClient };
};

export default useWatchLocation;
