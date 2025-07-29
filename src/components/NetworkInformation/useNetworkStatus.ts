import { useSyncExternalStore } from 'react';

export const useNetworkStatus = () => {
    const subscribe = (callback: () => void) => {
        window.addEventListener('online', callback);
        window.addEventListener('offline', callback);
        return () => {
            window.removeEventListener('online', callback);
            window.removeEventListener('offline', callback);
        };
    };

    const getSnapshot = () => {
        return navigator.onLine;
    };

    const getServerSnapshot = () => {
        return false;
    };

    const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    return isOnline;
};
