import { useSyncExternalStore, useEffect, useState } from 'react';

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
    const [isClient, setIsClient] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setIsSupported('connection' in navigator);
    }, []);

    const subscribe = (callback: () => void) => {
        if (!isSupported) return () => {};
        
        (navigator as NavigatorWithConnection).connection?.addEventListener('change', callback);

        return () => {
            (navigator as NavigatorWithConnection).connection?.removeEventListener('change', callback);
        };
    };

    const getSnapshot = () => {
        if (!isSupported) return null;
        return (navigator as NavigatorWithConnection).connection || null;
    };

    const getServerSnapshot = () => {
        return null;
    };

    const connection = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    return { connection, isSupported, isClient };
};
