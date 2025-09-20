'use client';

import { Chip } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useClientSide } from '@/hooks/useClientSide';
import { useEffect, useState } from 'react';

export default function VibrationSupport() {
    const isClient = useClientSide();
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if (isClient) {
            setIsSupported('vibrate' in navigator);
        }
    }, [isClient]);

    // Не рендерим ничего до монтирования на клиенте
    if (!isClient) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            {isSupported ? (
                <Chip icon={<ThumbUpIcon />} label="Вибрация поддерживается" color="success" />
            ) : (
                <Chip icon={<ThumbDownIcon />} label="Вибрация не поддерживается" color="error" />
            )}
        </div>
    );
}
