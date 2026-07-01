import { useEffect, useState } from 'react';
import { useClientSide } from '@/hooks/useClientSide';

/**
 * Объект BatteryManager из Battery Status API.
 * Расширяет EventTarget, чтобы подписываться на события изменения заряда.
 */
interface BatteryManager extends EventTarget {
    charging: boolean;
    level: number;
    chargingTime: number;
    dischargingTime: number;
}

declare global {
    interface Navigator {
        /** Метод Battery Status API; отсутствует в большинстве современных браузеров */
        getBattery?: () => Promise<BatteryManager>;
    }
}

/**
 * Дискриминированный union состояний батареи.
 * Позволяет безопасно обрабатывать загрузку, ошибки и отсутствие поддержки API.
 */
export type BatteryState =
    | { status: 'loading' }
    | { status: 'unsupported' }
    | { status: 'error' }
    | {
          status: 'ready';
          /** Уровень заряда от 0.0 (пусто) до 1.0 (полный) */
          level: number;
          charging: boolean;
          /** Время до полной зарядки в секундах; Infinity при разрядке */
          chargingTime: number;
          /** Время до разрядки в секундах; Infinity при зарядке или полном заряде */
          dischargingTime: number;
      };

/**
 * Форматирует уровень заряда в проценты для отображения.
 *
 * @param level — значение от 0.0 до 1.0
 * @returns строка вида «87%»
 */
export const formatBatteryLevel = (level: number): string => `${Math.round(level * 100)}%`;

/**
 * Форматирует время батареи в читаемый вид.
 * API возвращает Infinity, когда время неизвестно или неприменимо.
 *
 * @param seconds — время в секундах
 * @returns «2 ч 15 мин», «45 мин» или «—» для Infinity/NaN
 */
export const formatBatteryTime = (seconds: number): string => {
    // Infinity приходит, когда устройство разряжается (chargingTime)
    // или уже заряжено / заряжается (dischargingTime)
    if (!Number.isFinite(seconds)) return '—';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return hours > 0 ? `${hours} ч ${minutes} мин` : `${minutes} мин`;
};

/**
 * Возвращает цвет индикатора заряда для MUI LinearProgress.
 *
 * @param level — уровень заряда от 0.0 до 1.0
 */
export const getBatteryLevelColor = (level: number): 'success' | 'warning' | 'error' => {
    if (level > 0.5) return 'success';
    if (level > 0.2) return 'warning';
    return 'error';
};

/**
 * Хук для получения и отслеживания состояния батареи через Battery Status API.
 * Подписывается на события BatteryManager и обновляет состояние при изменениях.
 *
 * @returns текущее состояние батареи (загрузка, ошибка, не поддерживается или данные)
 */
export const useBattery = (): BatteryState => {
    const isClient = useClientSide();
    const [state, setState] = useState<BatteryState>({ status: 'loading' });

    useEffect(() => {
        // На сервере navigator недоступен — ждём монтирования на клиенте
        if (!isClient) return;

        if (!navigator.getBattery) {
            setState({ status: 'unsupported' });
            return;
        }

        let battery: BatteryManager | null = null;
        // Флаг отмены: getBattery() асинхронный, компонент может размонтироваться до resolve
        let cancelled = false;

        const update = () => {
            if (!battery || cancelled) return;

            setState({
                status: 'ready',
                level: battery.level,
                charging: battery.charging,
                chargingTime: battery.chargingTime,
                dischargingTime: battery.dischargingTime,
            });
        };

        navigator
            .getBattery()
            .then((b) => {
                if (cancelled) return;

                battery = b;
                update();

                // Подписка на все события BatteryManager для live-обновления UI
                b.addEventListener('levelchange', update);
                b.addEventListener('chargingchange', update);
                b.addEventListener('chargingtimechange', update);
                b.addEventListener('dischargingtimechange', update);
            })
            .catch(() => {
                if (!cancelled) {
                    setState({ status: 'error' });
                }
            });

        return () => {
            cancelled = true;

            if (!battery) return;

            battery.removeEventListener('levelchange', update);
            battery.removeEventListener('chargingchange', update);
            battery.removeEventListener('chargingtimechange', update);
            battery.removeEventListener('dischargingtimechange', update);
        };
    }, [isClient]);

    return state;
};
