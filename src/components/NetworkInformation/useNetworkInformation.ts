import { useSyncExternalStore, useEffect, useState } from 'react';

interface NetworkInformation extends EventTarget {
    effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
    downlink: number;
    downlinkMax: number;
    rtt: number;
    saveData: boolean;
    type: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
}

interface NavigatorWithConnection extends Navigator {
    connection?: NetworkInformation;
}

function getConnection(): NetworkInformation | null {
    if (typeof navigator === 'undefined') return null;
    return (navigator as NavigatorWithConnection).connection ?? null;
}

/** Стабильная подписка — не пересоздаётся на каждый рендер */
function subscribeConnection(callback: () => void) {
    const connection = getConnection();
    if (!connection) {
        return () => {};
    }

    connection.addEventListener('change', callback);
    return () => {
        connection.removeEventListener('change', callback);
    };
}

function getServerSnapshot(): NetworkInformation | null {
    return null;
}

export const useNetworkStatus = () => {
    const [isClient, setIsClient] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setIsSupported('connection' in navigator);
    }, []);

    const connection = useSyncExternalStore(subscribeConnection, getConnection, getServerSnapshot);

    return { connection: isSupported ? connection : null, isSupported, isClient };
};
