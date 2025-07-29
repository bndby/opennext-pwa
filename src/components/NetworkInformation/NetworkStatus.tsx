'use client';

import { Chip } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useNetworkStatus } from './useNetworkStatus';

export const NetworkStatus = () => {
    const isOnline = useNetworkStatus();

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
