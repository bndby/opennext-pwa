import { useEffect, useState } from 'react';
import { checkBrowserSupport } from '@/lib/browser-support';
import { useClientSide } from './useClientSide';

/**
 * Хук для проверки поддержки браузерного API.
 * @param apiName — имя API (`speechSynthesis`, `NDEFReader`, `contacts`, `getBattery`…)
 * @returns поддерживается ли API в браузере
 */
export function useBrowserSupport(apiName: string): boolean {
    const isClient = useClientSide();
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if (isClient) {
            setIsSupported(checkBrowserSupport(apiName));
        }
    }, [apiName, isClient]);

    return isSupported;
}
