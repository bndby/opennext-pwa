import { useSyncExternalStore } from 'react';

// Расширяем интерфейс Navigator для Network Information API
interface NetworkInformation extends EventTarget {
    effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
    downlink: number; // Mb/sec
    downlinkMax: number; // Mb/sec
    rtt: number; // ms
    saveData: boolean; // true if user has enabled data saver mode
    type: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
}

interface NavigatorWithConnection extends Navigator {
    connection?: NetworkInformation;
}

export const useNetworkStatus = () => {
    const subscribe = (callback: () => void) => {
        (navigator as NavigatorWithConnection).connection?.addEventListener('change', callback);

        return () => {
            (navigator as NavigatorWithConnection).connection?.removeEventListener('change', callback);
        };
    };

    const getSnapshot = () => {
        return (navigator as NavigatorWithConnection).connection || null;
    };

    const getServerSnapshot = () => {
        return null;
    };

    const connection = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    return connection;
};
