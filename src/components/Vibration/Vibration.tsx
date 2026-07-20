'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Box, Typography, Alert } from '@mui/material';
import { buildVibrationPattern } from '@/lib/vibration-pattern';

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
    const playTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    useEffect(() => {
        return () => {
            if (playTimeoutRef.current != null) {
                clearTimeout(playTimeoutRef.current);
                playTimeoutRef.current = null;
            }
            if ('vibrate' in navigator) {
                navigator.vibrate(0);
            }
        };
    }, []);

    const clearPlayTimeout = useCallback(() => {
        if (playTimeoutRef.current != null) {
            clearTimeout(playTimeoutRef.current);
            playTimeoutRef.current = null;
        }
    }, []);

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
            clearPlayTimeout();
            setIsPlaying(true);
            setError(null);

            const { pattern, totalDuration } = buildVibrationPattern(touches);
            navigator.vibrate(pattern);

            playTimeoutRef.current = setTimeout(() => {
                setIsPlaying(false);
                navigator.vibrate(0);
                playTimeoutRef.current = null;
            }, totalDuration + 100);
        } catch {
            setError('Ошибка при воспроизведении вибрации');
            setIsPlaying(false);
        }
    };

    const stopVibration = () => {
        clearPlayTimeout();
        setIsPlaying(false);
        navigator.vibrate(0);
    };

    const testVibration = () => {
        if (!isSupported) return;

        try {
            navigator.vibrate([100, 50, 200]);
        } catch {
            setError('Ошибка при тестовой вибрации');
        }
    };

    const patternPreview = buildVibrationPattern(touches).pattern;

    if (!isSupported) {
        return <Alert severity="warning">{error}</Alert>;
    }

    return (
        <Box sx={{ p: 2 }}>
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

                    <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>
                        Паттерн: [{patternPreview.join(', ')}] мс
                    </Typography>
                </Box>
            )}

            {isPlaying && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    Воспроизведение вибрации...
                </Alert>
            )}
        </Box>
    );
};
