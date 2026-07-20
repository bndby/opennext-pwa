import { describe, expect, it } from 'vitest';
import { formatBatteryLevel, formatBatteryTime, getBatteryLevelColor } from '../battery';
import { checkBrowserSupport, isNavigatorApi } from '../browser-support';
import { decodeNdefRecordData, formatNdefMessage } from '../nfc';
import { buildVibrationPattern } from '../vibration-pattern';

describe('formatBatteryLevel', () => {
    it('форматирует долю в проценты', () => {
        expect(formatBatteryLevel(0.87)).toBe('87%');
        expect(formatBatteryLevel(0)).toBe('0%');
        expect(formatBatteryLevel(1)).toBe('100%');
    });
});

describe('formatBatteryTime', () => {
    it('возвращает тире для Infinity/NaN', () => {
        expect(formatBatteryTime(Infinity)).toBe('—');
        expect(formatBatteryTime(NaN)).toBe('—');
    });

    it('форматирует минуты и часы', () => {
        expect(formatBatteryTime(45 * 60)).toBe('45 мин');
        expect(formatBatteryTime(2 * 3600 + 15 * 60)).toBe('2 ч 15 мин');
    });
});

describe('getBatteryLevelColor', () => {
    it('выбирает цвет по уровню', () => {
        expect(getBatteryLevelColor(0.8)).toBe('success');
        expect(getBatteryLevelColor(0.3)).toBe('warning');
        expect(getBatteryLevelColor(0.1)).toBe('error');
    });
});

describe('browser-support', () => {
    it('помечает navigator API', () => {
        expect(isNavigatorApi('contacts')).toBe(true);
        expect(isNavigatorApi('getBattery')).toBe(true);
        expect(isNavigatorApi('NDEFReader')).toBe(false);
    });

    it('возвращает false без window', () => {
        // в node window отсутствует
        expect(checkBrowserSupport('speechSynthesis')).toBe(false);
        expect(checkBrowserSupport('contacts')).toBe(false);
    });
});

describe('nfc', () => {
    it('декодирует UTF-8 DataView', () => {
        const bytes = new TextEncoder().encode('hello');
        const data = new DataView(bytes.buffer);
        expect(decodeNdefRecordData({ data, encoding: 'utf-8' })).toBe('hello');
    });

    it('форматирует список записей', () => {
        const bytes = new TextEncoder().encode('test');
        const msg = formatNdefMessage([{ recordType: 'text', data: new DataView(bytes.buffer) }]);
        expect(msg).toContain('[0] text:');
        expect(msg).toContain('test');
    });

    it('пустой список', () => {
        expect(formatNdefMessage([])).toContain('пустое');
    });
});

describe('buildVibrationPattern', () => {
    it('пустой ввод', () => {
        expect(buildVibrationPattern([])).toEqual({ pattern: [], totalDuration: 0 });
    });

    it('использует реальные паузы между касаниями', () => {
        const touches = [
            { startTime: 1000, endTime: 1100, duration: 100 },
            { startTime: 1300, endTime: 1500, duration: 200 },
        ];
        const { pattern, totalDuration } = buildVibrationPattern(touches);
        expect(pattern).toEqual([100, 200, 200]);
        expect(totalDuration).toBe(500);
    });

    it('минимум 1мс паузы при перекрытии', () => {
        const touches = [
            { startTime: 1000, endTime: 1200, duration: 200 },
            { startTime: 1100, endTime: 1300, duration: 200 },
        ];
        const { pattern } = buildVibrationPattern(touches);
        expect(pattern[1]).toBe(1);
    });
});
