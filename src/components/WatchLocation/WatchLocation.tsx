'use client';

import useWatchLocation from '@/hooks/useWatchLocation';
import {
    YMap,
    YMapComponentsProvider,
    YMapDefaultFeaturesLayer,
    YMapDefaultMarker,
    YMapDefaultSchemeLayer,
} from 'ymap3-components';

export default function WatchLocation() {
    const { location, error } = useWatchLocation();

    return (
        <div>
            <p>Latitude: {location?.latitude}</p>
            <p>Longitude: {location?.longitude}</p>
            <p>Error: {error}</p>

            <YMapComponentsProvider apiKey={'fa88ed96-7c2b-4d07-8e74-1ac86a9ac3fd'}>
                <YMap location={{ center: [37.588144, 55.733842], zoom: 9 }}>
                    <YMapDefaultSchemeLayer />
                    <YMapDefaultFeaturesLayer />
                    {location && <YMapDefaultMarker coordinates={[location.longitude, location.latitude]} />}
                </YMap>
            </YMapComponentsProvider>
        </div>
    );
}
