import { useEffect, useState } from 'react';

/**
 * Хук для проверки, что компонент рендерится на клиенте
 * Помогает предотвратить ошибки гидратации
 */
export function useClientSide() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return isClient;
}

/**
 * Хук для проверки поддержки браузерного API
 * @param apiName - имя API для проверки (например, 'speechSynthesis', 'NDEFReader')
 * @returns [isClient, isSupported]
 */
export function useBrowserSupport(apiName: string): [boolean, boolean] {
    const [isClient, setIsClient] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setIsSupported(apiName in window);
    }, [apiName]);

    return [isClient, isSupported];
}
