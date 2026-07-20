export type TouchTiming = {
    startTime: number;
    endTime: number;
    duration: number;
};

/**
 * Строит паттерн Vibration API из касаний с реальными паузами между ними.
 * Формат: [vibrate, pause, vibrate, pause, …, vibrate]
 */
export function buildVibrationPattern(touches: TouchTiming[]): { pattern: number[]; totalDuration: number } {
    if (touches.length === 0) {
        return { pattern: [], totalDuration: 0 };
    }

    const sorted = [...touches].sort((a, b) => a.startTime - b.startTime);
    const pattern: number[] = [];
    let totalDuration = 0;

    sorted.forEach((touch, index) => {
        const duration = Math.max(0, touch.duration);
        pattern.push(duration);
        totalDuration += duration;

        if (index < sorted.length - 1) {
            const next = sorted[index + 1];
            const gap = Math.max(0, next.startTime - touch.endTime);
            // Vibration API игнорирует паузу 0 между двумя вибрациями — оставляем минимум 1мс,
            // если касания перекрываются или идут вплотную
            const pause = Math.max(1, gap);
            pattern.push(pause);
            totalDuration += pause;
        }
    });

    return { pattern, totalDuration };
}
