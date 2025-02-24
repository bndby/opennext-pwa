'use client';

import React, { useEffect } from 'react';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import 'ol/ol.css';
import { Feature } from 'ol';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Fill, Stroke } from 'ol/style';
import CircleStyle from 'ol/style/Circle';

export type MapViewProps = {
    latitude: number;
    longitude: number;
};

function MapView({ latitude, longitude }: MapViewProps) {
    useEffect(() => {
        const map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: fromLonLat([longitude, latitude]),
                zoom: 13,
            }),
        });

        const point = new Point(fromLonLat([longitude, latitude]));
        const marker = new Feature({
            geometry: point,
        });

        marker.setStyle(
            new Style({
                image: new CircleStyle({
                    radius: 5,
                    fill: new Fill({ color: 'red' }),
                    stroke: new Stroke({
                        color: 'black',
                        width: 1,
                    }),
                }),
            }),
        );

        const vectorSource = new VectorSource({
            features: [marker],
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource,
        });

        map.addLayer(vectorLayer);

        return () => {
            map.setTarget(undefined);
        };
    }, [latitude, longitude]);

    return <div id="map" style={{ width: '100%', height: '400px' }} />;
}

export default MapView;
