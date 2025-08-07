import { useSyncExternalStore, useEffect, useState } from 'react';

export const useNetworkStatus = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const subscribe = (callback: () => void) => {
        if (!isClient) return () => {};

        window.addEventListener('online', callback);
        window.addEventListener('offline', callback);
        return () => {
            window.removeEventListener('online', callback);
            window.removeEventListener('offline', callback);
        };
    };

    const getSnapshot = () => {
        if (!isClient) return false;
        return navigator.onLine;
    };

    const getServerSnapshot = () => {
        return false;
    };

    const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    return { isOnline, isClient };
};
