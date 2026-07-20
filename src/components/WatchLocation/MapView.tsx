'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';
import { RFeature, RGeolocation, RLayerVector, RMap, RStyle, useOL } from 'rlayers';
import pin from './pin.svg';
import { Geometry, Point } from 'ol/geom';
import { Geolocation as OLGeoLoc } from 'ol';
import BaseEvent from 'ol/events/Event';
import RLayerStadia from 'rlayers/layer/RLayerStadia';

export type MapViewProps = {
    latitude: number;
    longitude: number;
};

/** Слой геолокации — только внутри RMap, где доступен useOL */
function MapGeolocationContent({ latitude, longitude }: MapViewProps) {
    const [pos, setPos] = useState(new Point(fromLonLat([longitude, latitude])));
    const [accuracy, setAccuracy] = useState<Geometry | undefined>(undefined);
    const { map } = useOL();

    useEffect(() => {
        setPos(new Point(fromLonLat([longitude, latitude])));
    }, [latitude, longitude]);

    const onChangeCallback = useCallback(
        (e: BaseEvent) => {
            const geoloc = e.target as OLGeoLoc;
            const position = geoloc.getPosition();
            const accuracyGeom = geoloc.getAccuracyGeometry();

            if (position) {
                setPos(new Point(position));
            }

            if (accuracyGeom) {
                setAccuracy(accuracyGeom);

                map?.getView()?.fit(accuracyGeom, {
                    duration: 250,
                    maxZoom: 15,
                });
            }
        },
        [map],
    );

    return (
        <>
            <RGeolocation tracking={true} trackingOptions={{ enableHighAccuracy: true }} onChange={onChangeCallback} />
            <RLayerVector zIndex={10}>
                <RStyle.RStyle>
                    <RStyle.RIcon src={pin.src} anchor={[0.5, 0.8]} />
                    <RStyle.RStroke color={'#007bff'} width={3} />
                </RStyle.RStyle>
                <RFeature geometry={pos}></RFeature>
                {accuracy && <RFeature geometry={accuracy}></RFeature>}
            </RLayerVector>
        </>
    );
}

export const MapView = ({ latitude, longitude }: MapViewProps) => {
    const [isClient, setIsClient] = useState(false);
    const center = fromLonLat([longitude, latitude]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <div>Загрузка карты...</div>;
    }

    return (
        <RMap width={'100%'} height={'400px'} initial={{ center, zoom: 13 }}>
            <MapGeolocationContent latitude={latitude} longitude={longitude} />
            <RLayerStadia layer="osm_bright" retina={true} />
        </RMap>
    );
};
