'use client';

import { useCallback, useState } from 'react';

export type PermissionResult = 'granted' | 'denied' | 'unsupported' | 'error';

type Requestable = {
    requestPermission?: () => Promise<'granted' | 'denied'>;
};

/**
 * Унифицированный запрос permission для DeviceMotion / DeviceOrientation / Notification и т.п.
 */
export function usePermissionRequest() {
    const [status, setStatus] = useState<PermissionResult | 'idle'>('idle');

    const request = useCallback(async (target: Requestable | null | undefined): Promise<PermissionResult> => {
        if (!target || typeof target.requestPermission !== 'function') {
            setStatus('unsupported');
            return 'unsupported';
        }

        try {
            const result = await target.requestPermission();
            setStatus(result);
            return result;
        } catch {
            setStatus('error');
            return 'error';
        }
    }, []);

    return { status, request };
}
