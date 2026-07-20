/**
 * Утилиты Battery Status API (чистые функции для UI и тестов).
 */

export const formatBatteryLevel = (level: number): string => `${Math.round(level * 100)}%`;

/**
 * Форматирует время батареи. API возвращает Infinity, когда время неизвестно.
 */
export const formatBatteryTime = (seconds: number): string => {
    if (!Number.isFinite(seconds)) return '—';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return hours > 0 ? `${hours} ч ${minutes} мин` : `${minutes} мин`;
};

export const getBatteryLevelColor = (level: number): 'success' | 'warning' | 'error' => {
    if (level > 0.5) return 'success';
    if (level > 0.2) return 'warning';
    return 'error';
};
