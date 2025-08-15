'use client';

import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function DeviceMotion() {
    const [xData, setXData] = useState<number[]>([]);
    const [yData, setYData] = useState<number[]>([]);
    const [zData, setZData] = useState<number[]>([]);

    useEffect(() => {
        const handleDeviceMotion = (event: DeviceMotionEvent) => {
            setXData((prev) => [...prev, event.acceleration?.x || 0]);
            setYData((prev) => [...prev, event.acceleration?.y || 0]);
            setZData((prev) => [...prev, event.acceleration?.z || 0]);
        };

        window.addEventListener('devicemotion', handleDeviceMotion);

        return () => {
            window.removeEventListener('devicemotion', handleDeviceMotion);
        };
    }, []);

    return (
        <div>
            <h2>X-координата</h2>
            <LineChart
                height={300}
                series={[
                    {
                        label: 'X',
                        data: xData,
                    },
                    {
                        label: 'Y',
                        data: yData,
                    },
                    {
                        label: 'Z',
                        data: zData,
                    },
                ]}
            />
        </div>
    );
}
