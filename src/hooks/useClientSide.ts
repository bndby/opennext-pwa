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
