'use client';

import React from 'react';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';
import { RFeature, RLayerVector, RMap, ROSM, RStyle } from 'rlayers';
import pin from './pin.svg';
import { Circle, Point } from 'ol/geom';

export type MapViewProps = {
    latitude: number;
    longitude: number;
    accuracy: number;
};

export const MapView = ({ latitude, longitude, accuracy }: MapViewProps) => {
    const center = fromLonLat([longitude, latitude]);

    console.log('pin', pin);

    return (
        <RMap width={'100%'} height={'400px'} initial={{ center: center, zoom: 13 }}>
            <ROSM />
            <RLayerVector zIndex={10}>
                <RStyle.RStyle>
                    <RStyle.RIcon src={pin.src} anchor={[0.5, 0.8]} />
                    <RStyle.RStroke color={'#007bff'} width={3} />
                </RStyle.RStyle>
                <RFeature geometry={new Point(fromLonLat([longitude, latitude]))}></RFeature>
                <RFeature geometry={new Circle(fromLonLat([longitude, latitude]), accuracy)}></RFeature>
            </RLayerVector>
        </RMap>
    );
};
