import { useSyncExternalStore } from 'react';

interface NetworkStatus {
    isOnline: boolean;
}

const subscribe = (callback: () => void) => {
    if (typeof window === 'undefined') return () => {};

    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
    return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
    };
};

const getSnapshot = (): boolean => {
    return typeof navigator !== 'undefined' ? navigator.onLine : false;
};

const getServerSnapshot = (): boolean => true;

export const useNetworkStatus = (): NetworkStatus => {
    const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    return { isOnline };
};
