'use client';

import { Chip } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useClientSide } from '@/hooks/useClientSide';
import { useEffect, useState } from 'react';

/**
 * Индикатор поддержки Battery Status API в текущем браузере.
 * Отображает Chip с результатом проверки наличия navigator.getBattery.
 */
export default function BatterySupport() {
    const isClient = useClientSide();
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if (isClient) {
            // Проверяем наличие метода, а не вызываем getBattery — это лёгкая синхронная проверка
            setIsSupported('getBattery' in navigator);
        }
    }, [isClient]);

    // До гидратации navigator недоступен — показываем заглушку
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
