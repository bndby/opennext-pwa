import { useEffect, useState } from 'react';
import { useClientSide } from './useClientSide';

/**
 * Хук для проверки поддержки браузерного API
 * @param apiName - имя API для проверки (например, 'speechSynthesis', 'NDEFReader')
 * @returns isSupported - поддерживается ли API в браузере
 */
export function useBrowserSupport(apiName: string): boolean {
    const isClient = useClientSide();
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if (isClient) {
            setIsSupported(apiName in window);
        }
    }, [apiName, isClient]);

    return isSupported;
}
