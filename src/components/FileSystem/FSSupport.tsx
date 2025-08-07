'use client';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { Chip } from '@mui/material';
import { useBrowserSupport } from '@/hooks/useClientSide';

export default function FSSupport() {
    const [isClient, isSupported] = useBrowserSupport('showOpenFilePicker');

    // Не рендерим ничего до монтирования на клиенте
    if (!isClient) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            {isSupported ? (
                <Chip icon={<ThumbUpIcon />} label="Supported" color="success" />
            ) : (
                <Chip icon={<ThumbDownIcon />} label="Not supported" color="error" />
            )}
        </div>
    );
}
