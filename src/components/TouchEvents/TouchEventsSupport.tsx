'use client';

import { Chip } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useClientSide } from '@/hooks/useClientSide';
import { useEffect, useState } from 'react';

export default function TouchEventsSupport() {
    const isClient = useClientSide();
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if (isClient) {
            // Проверяем поддержку Touch Events API
            // Touch Events поддерживаются если есть 'ontouchstart' в window или document
            const hasTouchEvents =
                'ontouchstart' in window ||
                'ontouchstart' in document.documentElement ||
                navigator.maxTouchPoints > 0 ||
                ('DocumentTouch' in window &&
                    document instanceof (window as Window & { DocumentTouch: typeof Document }).DocumentTouch);

            setIsSupported(hasTouchEvents);
        }
    }, [isClient]);

    // Не рендерим ничего до монтирования на клиенте
    if (!isClient) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            {isSupported ? (
                <Chip icon={<ThumbUpIcon />} label="Touch Events поддерживается" color="success" />
            ) : (
                <Chip icon={<ThumbDownIcon />} label="Touch Events не поддерживается" color="error" />
            )}
        </div>
    );
}
