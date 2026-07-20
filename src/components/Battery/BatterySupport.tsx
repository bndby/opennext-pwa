'use client';

import { Chip } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useClientSide } from '@/hooks/useClientSide';
import { useBrowserSupport } from '@/hooks/useBrowserSupport';

/**
 * Индикатор поддержки Battery Status API в текущем браузере.
 */
export default function BatterySupport() {
    const isClient = useClientSide();
    const isSupported = useBrowserSupport('getBattery');

    if (!isClient) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            {isSupported ? (
                <Chip icon={<ThumbUpIcon />} label="Battery Status API поддерживается" color="success" />
            ) : (
                <Chip icon={<ThumbDownIcon />} label="Battery Status API не поддерживается" color="error" />
            )}
        </div>
    );
}
