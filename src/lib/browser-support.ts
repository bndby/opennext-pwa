/** API, которые живут на `navigator`, а не на `window`. */
const NAVIGATOR_APIS = new Set([
    'contacts',
    'getBattery',
    'geolocation',
    'connection',
    'mediaDevices',
    'vibrate',
    'serviceWorker',
    'standalone',
]);

/**
 * Синхронная проверка поддержки браузерного API.
 * Для Contacts / Battery / Geolocation и т.п. проверяет `navigator`,
 * для остального — `window`.
 */
export function checkBrowserSupport(apiName: string): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    if (NAVIGATOR_APIS.has(apiName)) {
        return apiName in navigator;
    }

    return apiName in window;
}

export function isNavigatorApi(apiName: string): boolean {
    return NAVIGATOR_APIS.has(apiName);
}
