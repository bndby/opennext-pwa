'use client';

import React, { useState, useEffect } from 'react';
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

export const MapView = ({ latitude, longitude }: MapViewProps) => {
    const [isClient, setIsClient] = useState(false);
    const center = fromLonLat([longitude, latitude]);
    const [pos, setPos] = useState(new Point(fromLonLat([longitude, latitude])));
    const [accuracy, setAccuracy] = useState(undefined as Geometry | undefined);
    // Low-level access to the OpenLayers API
    const { map } = useOL();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const onChangeCallback = React.useCallback(
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

    // Не рендерим ничего до монтирования на клиенте
    if (!isClient) {
        return <div>Загрузка карты...</div>;
    }

    return (
        <RMap width={'100%'} height={'400px'} initial={{ center: center, zoom: 13 }}>
            <RGeolocation tracking={true} trackingOptions={{ enableHighAccuracy: true }} onChange={onChangeCallback} />
            {/* <ROSM /> */}
            <RLayerStadia layer="osm_bright" retina={true} />
            <RLayerVector zIndex={10}>
                <RStyle.RStyle>
                    <RStyle.RIcon src={pin.src} anchor={[0.5, 0.8]} />
                    <RStyle.RStroke color={'#007bff'} width={3} />
                </RStyle.RStyle>
                <RFeature geometry={pos}></RFeature>
                <RFeature geometry={accuracy}></RFeature>
            </RLayerVector>
        </RMap>
    );
};
