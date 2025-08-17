'use client';

import React, { useEffect, useState } from 'react';
import { RadarChart } from '@mui/x-charts/RadarChart';

export default function DeviceMotion() {
    const [xData, setXData] = useState<number>(0);
    const [yData, setYData] = useState<number>(0);
    const [zData, setZData] = useState<number>(0);

    useEffect(() => {
        const handleDeviceMotion = (event: DeviceMotionEvent) => {
            setXData(event.acceleration?.x ?? 0);
            setYData(event.acceleration?.y ?? 0);
            setZData(event.acceleration?.z ?? 0);
        };

        window.addEventListener('devicemotion', handleDeviceMotion);

        return () => {
            window.removeEventListener('devicemotion', handleDeviceMotion);
        };
    }, []);

    return (
        <div>
            <RadarChart
                height={300}
                series={[{ label: 'Acceleration', data: [xData, yData, zData] }]}
                radar={{
                    max: 120,
                    metrics: ['X', 'Y', 'Z'],
                }}
            />
        </div>
    );
}
