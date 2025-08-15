'use client';

import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function DeviceMotion() {
    const [xData, setXData] = useState<number[]>([]);
    const [yData, setYData] = useState<number[]>([]);
    const [zData, setZData] = useState<number[]>([]);

    useEffect(() => {
        const handleDeviceMotion = (event: DeviceMotionEvent) => {
            setXData((prev) => {
                const newData = [...prev, event.acceleration?.x || 0];
                return newData.length > 50 ? newData.slice(-50) : newData;
            });
            setYData((prev) => {
                const newData = [...prev, event.acceleration?.y || 0];
                return newData.length > 50 ? newData.slice(-50) : newData;
            });
            setZData((prev) => {
                const newData = [...prev, event.acceleration?.z || 0];
                return newData.length > 50 ? newData.slice(-50) : newData;
            });
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
                        showMark: false,
                    },
                    {
                        label: 'Y',
                        data: yData,
                        showMark: false,
                    },
                    {
                        label: 'Z',
                        data: zData,
                        showMark: false,
                    },
                ]}
            />
        </div>
    );
}
