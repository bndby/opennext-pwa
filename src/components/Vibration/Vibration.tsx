'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Box, Typography, Alert } from '@mui/material';

interface TouchData {
    id: number;
    startTime: number;
    endTime: number;
    duration: number;
}

export const Vibration = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [touches, setTouches] = useState<TouchData[]>([]);
    const [isSupported, setIsSupported] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const touchIdCounter = useRef(0);
    const activeTouches = useRef<Map<number, TouchData>>(new Map());

    // Проверка доступности API
    useEffect(() => {
        const vibrationSupported = 'vibrate' in navigator;
        const touchSupported = 'ontouchstart' in window;

        setIsSupported(vibrationSupported && touchSupported);

        if (!vibrationSupported) {
            setError('Vibration API не поддерживается');
        } else if (!touchSupported) {
            setError('Touch events не поддерживаются');
        }
    }, []);

    // Обработчики touch событий
    const handleTouchStart = useCallback(
        (event: React.TouchEvent) => {
            if (!isRecording) return;
            event.preventDefault();

            Array.from(event.changedTouches).forEach((touch) => {
                const touchData: TouchData = {
                    id: touchIdCounter.current++,
                    startTime: Date.now(),
                    endTime: 0,
                    duration: 0,
                };
                activeTouches.current.set(touch.identifier, touchData);
            });
        },
        [isRecording],
    );

    const handleTouchEnd = useCallback(
        (event: React.TouchEvent) => {
            if (!isRecording) return;
            event.preventDefault();

            Array.from(event.changedTouches).forEach((touch) => {
                const touchData = activeTouches.current.get(touch.identifier);
                if (touchData) {
                    const endTime = Date.now();
                    const updatedTouch: TouchData = {
                        ...touchData,
                        endTime,
                        duration: endTime - touchData.startTime,
                    };
                    setTouches((prev) => [...prev, updatedTouch]);
                    activeTouches.current.delete(touch.identifier);
                }
            });
        },
        [isRecording],
    );

    // Функции управления
    const startRecording = () => {
        setIsRecording(true);
        setTouches([]);
        setError(null);
        touchIdCounter.current = 0;
        activeTouches.current.clear();
    };

    const stopRecording = () => {
        setIsRecording(false);
        const now = Date.now();
        activeTouches.current.forEach((touchData) => {
            const updatedTouch: TouchData = {
                ...touchData,
                endTime: now,
                duration: now - touchData.startTime,
            };
            setTouches((prev) => [...prev, updatedTouch]);
        });
        activeTouches.current.clear();
    };

    const playVibration = () => {
        if (!isSupported || touches.length === 0) return;

        try {
            setIsPlaying(true);
            setError(null);

            // Создаем паттерн вибрации с паузами между касаниями
            const pattern: number[] = [];
            let totalDuration = 0;

            touches.forEach((touch, index) => {
                // Добавляем длительность вибрации
                pattern.push(touch.duration);
                totalDuration += touch.duration;

                // Добавляем паузу между касаниями (кроме последнего)
                if (index < touches.length - 1) {
                    const pause = Math.max(50, Math.min(200, touch.duration * 0.3)); // Пауза от 50 до 200мс
                    pattern.push(pause);
                    totalDuration += pause;
                }
            });

            navigator.vibrate(pattern);

            // Останавливаем воспроизведение через общую длительность паттерна
            setTimeout(() => {
                setIsPlaying(false);
                navigator.vibrate(0);
            }, totalDuration + 100);
        } catch {
            setError('Ошибка при воспроизведении вибрации');
            setIsPlaying(false);
        }
    };

    const stopVibration = () => {
        setIsPlaying(false);
        navigator.vibrate(0);
    };

    const testVibration = () => {
        if (!isSupported) return;

        try {
            // Простой тестовый паттерн: короткая вибрация, пауза, длинная вибрация
            navigator.vibrate([100, 50, 200]);
        } catch {
            setError('Ошибка при тестовой вибрации');
        }
    };

    if (!isSupported) {
        return <Alert severity="warning">{error}</Alert>;
    }

    return (
        <Box sx={{ p: 2 }}>
            {/* Область для касаний */}
            <Box
                sx={{
                    height: 200,
                    border: isRecording ? '2px solid red' : '2px dashed #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    touchAction: 'none',
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <Typography>{isRecording ? `Запись... (${touches.length})` : 'Касайтесь экрана для записи'}</Typography>
            </Box>

            {/* Кнопки управления */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Button variant="contained" onClick={startRecording} disabled={isRecording || isPlaying}>
                    Начать запись
                </Button>
                <Button variant="outlined" onClick={stopRecording} disabled={!isRecording}>
                    Остановить
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={playVibration}
                    disabled={touches.length === 0 || isPlaying}
                >
                    Воспроизвести
                </Button>
                <Button variant="outlined" onClick={stopVibration} disabled={!isPlaying}>
                    Остановить вибрацию
                </Button>
                <Button variant="outlined" color="secondary" onClick={testVibration}>
                    Тест вибрации
                </Button>
            </Box>

            {/* Информация о касаниях */}
            {touches.length > 0 && (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Записанные касания: {touches.length}
                    </Typography>
                    <Box sx={{ maxHeight: 150, overflow: 'auto' }}>
                        {touches.map((touch, index) => (
                            <Typography key={touch.id} variant="body2">
                                Касание {index + 1}: {touch.duration}ms
                            </Typography>
                        ))}
                    </Box>

                    {/* Показываем паттерн вибрации */}
                    <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>
                        Паттерн: [
                        {touches
                            .map((touch, index) => {
                                const pause =
                                    index < touches.length - 1 ? Math.max(50, Math.min(200, touch.duration * 0.3)) : 0;
                                return pause > 0 ? `${touch.duration}, ${pause}` : touch.duration;
                            })
                            .join(', ')}
                        ] мс
                    </Typography>
                </Box>
            )}

            {/* Статус воспроизведения */}
            {isPlaying && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    Воспроизведение вибрации...
                </Alert>
            )}
        </Box>
    );
};
