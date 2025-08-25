'use client';

import { Chip } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useNetworkStatus } from './useNetworkStatus';
import { useClientSide } from '../../hooks/useClientSide';

export const NetworkStatus = () => {
    const { isOnline } = useNetworkStatus();
    const isClient = useClientSide();

    // Не рендерим ничего до монтирования на клиенте
    if (!isClient) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            {isOnline ? (
                <Chip icon={<ThumbUpIcon />} label="Online" color="success" />
            ) : (
                <Chip icon={<ThumbDownIcon />} label="Offline" color="error" />
            )}
        </div>
    );
};
