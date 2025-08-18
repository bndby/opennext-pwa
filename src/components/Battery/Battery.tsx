'use client';

import { useEffect, useState } from 'react';

interface BatteryManager extends EventTarget {
    charging: boolean;
    level: number;
    chargingTime: number;
    dischargingTime: number;
}

declare global {
    interface Navigator {
        getBattery(): BatteryManager;
    }
}

export const Battery = () => {
    const [battery, setBattery] = useState<BatteryManager | null>(null);

    useEffect(() => {
        const getBattery = async () => {
            const battery = await navigator.getBattery();
            setBattery(battery);
        };
        getBattery();
    }, []);

    return (
        <div>
            <div>Charging time: {battery?.chargingTime}</div>
            <div>Discharging time: {battery?.dischargingTime}</div>
            <div>Level: {battery?.level}</div>
            <div>Charging: {battery?.charging ? 'Yes' : 'No'}</div>
        </div>
    );
};
