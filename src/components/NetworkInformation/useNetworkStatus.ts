import { useSyncExternalStore } from 'react';

interface NetworkStatus {
    isOnline: boolean;
}

export const useNetworkStatus = (): NetworkStatus => {
    const subscribe = (callback: () => void) => {
        // Проверяем доступность объекта window (клиентская среда)
        if (typeof window === 'undefined') return () => {};

        window.addEventListener('online', callback);
        window.addEventListener('offline', callback);
        return () => {
            window.removeEventListener('online', callback);
            window.removeEventListener('offline', callback);
        };
    };

    const getSnapshot = (): boolean => {
        // Проверяем доступность navigator (клиентская среда)
        if (typeof navigator === 'undefined') return false;
        return navigator.onLine;
    };

    const getServerSnapshot = (): boolean => {
        // На сервере считаем, что сеть доступна по умолчанию
        return true;
    };

    const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    return { isOnline };
};
