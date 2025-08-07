'use client';

import { Chip } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useBrowserSupport } from '@/hooks/useClientSide';

export default function ContactsSupport() {
    const [isClient, isSupported] = useBrowserSupport('contacts');

    // Не рендерим ничего до монтирования на клиенте
    if (!isClient) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            {isSupported ? (
                <Chip icon={<ThumbUpIcon />} label="Supported" color="success" />
            ) : (
                <Chip icon={<ThumbDownIcon />} label="Not Supported" color="error" />
            )}
        </div>
    );
}
