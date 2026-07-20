'use client';

import { useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { BarcodePrint } from './BarcodePrint';
import useBarcodeSupported from './useBarcodeSupported';
import { DetectedBarcode } from './types';
import { useMediaStream } from '@/hooks/useMediaStream';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';

function BarcodeDetectInner() {
    const videoRef = useRef<HTMLVideoElement>(null);

    const [barcodes, setBarcodes] = useState<DetectedBarcode[]>([]);
    const [messages, setMessages] = useState<string[]>([]);
    const [isDetecting, setIsDetecting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [isSupported, , isChecking] = useBarcodeSupported();
    const { isActive, isStarting, start, stop, attachTo, error: mediaError } = useMediaStream({
        video: { facingMode: 'environment' },
        audio: false,
    });

    const appendMessage = (message: string) => {
        setMessages((prev) => [...prev, message]);
    };

    useEffect(() => {
        attachTo(videoRef.current);
    }, [attachTo]);

    useEffect(() => {
        if (mediaError) {
            setErrorMessage(mediaError);
            appendMessage(mediaError);
        }
    }, [mediaError]);

    // Камеру не стартуем автоматически — только по жесту пользователя (handleStart)

    useEffect(() => {
        return () => {
            stop();
        };
    }, [stop]);

    const handleDetect = async () => {
        if (!videoRef.current || !isActive || isDetecting) {
            return;
        }
        setIsDetecting(true);
        setErrorMessage('');

        const barcodeDetector = new window.BarcodeDetector();
        try {
            const detectedBarcodes = (await barcodeDetector.detect(videoRef.current)) as DetectedBarcode[];
            setBarcodes(detectedBarcodes);
            appendMessage(`Найдено штрихкодов: ${detectedBarcodes.length}`);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Ошибка детекции штрихкодов.';
            setErrorMessage(`Ошибка детекции: ${message}`);
            appendMessage(`Ошибка детекции: ${message}`);
        } finally {
            setIsDetecting(false);
        }
    };

    const handleStop = () => {
        stop();
        appendMessage('Камера остановлена.');
    };

    const handleStart = async () => {
        if (!isSupported) return;
        const started = await start();
        if (started) {
            appendMessage('Камера запущена.');
        }
    };

    if (!isSupported && !isChecking) {
        return null;
    }

    return (
        <Box>
            <video
                ref={videoRef}
                width="100%"
                height="300"
                playsInline
                autoPlay
                muted
                aria-label="Предпросмотр камеры для распознавания штрихкодов"
                style={{ objectFit: 'cover', borderRadius: 8, backgroundColor: '#111' }}
            />

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                {isActive ? (
                    <>
                        <Button variant="contained" color="error" onClick={handleStop} disabled={isStarting || isDetecting}>
                            Остановить
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleDetect}
                            disabled={isStarting || isDetecting || !isActive}
                        >
                            {isDetecting ? 'Сканируем...' : 'Сканировать штрихкоды'}
                        </Button>
                    </>
                ) : (
                    <Button variant="contained" color="success" onClick={handleStart} disabled={isStarting || isChecking}>
                        {isStarting ? 'Запускаем...' : 'Запустить камеру'}
                    </Button>
                )}
            </Stack>

            {errorMessage && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {errorMessage}
                </Alert>
            )}

            <Box sx={{ mt: 2 }}>
                {barcodes.map((barcode, index) => (
                    <Box key={`${barcode.rawValue}-${index}`} sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            {barcode.format}: {barcode.rawValue}
                        </Typography>
                        <BarcodePrint barcode={barcode.rawValue} format={barcode.format} />
                    </Box>
                ))}
            </Box>

            {messages.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <pre style={{ fontSize: 11, margin: 0, whiteSpace: 'pre-wrap' }}>{messages.join('\n')}</pre>
                </Box>
            )}
        </Box>
    );
}

export const BarcodeDetect = () => (
    <ErrorBoundary title="Ошибка сканера штрихкодов">
        <BarcodeDetectInner />
    </ErrorBoundary>
);
