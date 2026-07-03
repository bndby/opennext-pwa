'use client';

import { Alert, Box, LinearProgress, Typography } from '@mui/material';
import {
    formatBatteryLevel,
    formatBatteryTime,
    getBatteryLevelColor,
    useBattery,
} from './useBattery';

/**
 * Компонент отображения состояния батареи устройства.
 * Использует Battery Status API через хук {@link useBattery}.
 */
export const Battery = () => {
    const battery = useBattery();

    if (battery.status === 'loading') {
        return <div>Загрузка...</div>;
    }

    if (battery.status === 'unsupported') {
        return (
            <Alert severity="warning">
                Battery Status API не поддерживается в вашем браузере. API снят с поддержки в большинстве
                браузеров из соображений приватности.
            </Alert>
        );
    }

    if (battery.status === 'error') {
        return <Alert severity="error">Не удалось получить информацию о батарее</Alert>;
    }

    // LinearProgress принимает value от 0 до 100, API отдаёт level от 0 до 1
    const levelPercent = Math.round(battery.level * 100);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Уровень заряда</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatBatteryLevel(battery.level)}
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={levelPercent}
                    color={getBatteryLevelColor(battery.level)}
                    sx={{ height: 10, borderRadius: 1 }}
                />
            </Box>

            <Typography>Зарядка: {battery.charging ? 'Да' : 'Нет'}</Typography>
            <Typography>
                Время до полной зарядки: {formatBatteryTime(battery.chargingTime)}
            </Typography>
            <Typography>
                Время до разрядки: {formatBatteryTime(battery.dischargingTime)}
            </Typography>
        </Box>
    );
};
