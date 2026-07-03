'use client';

import { useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { BarcodePrint } from './BarcodePrint';
import useBarcodeSupported from './useBarcodeSupported';
import { DetectedBarcode } from './types';

export const BarcodeDetect = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const [barcodes, setBarcodes] = useState<DetectedBarcode[]>([]);
    const [messages, setMessages] = useState<string[]>([]);
    const [isActive, setIsActive] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [isSupported, , isChecking] = useBarcodeSupported();

    const appendMessage = (message: string) => {
        setMessages((prev) => [...prev, message]);
    };

    const stopCamera = () => {
        const video = videoRef.current;
        if (!video) {
            setIsActive(false);
            return;
        }
        const stream = video.srcObject as MediaStream | null;
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            video.srcObject = null;
        }
        setIsActive(false);
    };

    const startCamera = async (): Promise<boolean> => {
        if (!videoRef.current || isStarting) {
            return false;
        }
        setIsStarting(true);
        setErrorMessage('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            } else {
                stream.getTracks().forEach((track) => track.stop());
            }
            setIsActive(true);
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Не удалось получить доступ к камере.';
            setErrorMessage(`Ошибка камеры: ${message}`);
            appendMessage(`Ошибка запуска камеры: ${message}`);
            setIsActive(false);
            return false;
        } finally {
            setIsStarting(false);
        }
    };

    useEffect(() => {
        if (isSupported) {
            void startCamera();
        }
        return () => {
            stopCamera();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSupported]);

    const handleDetect = async () => {
        if (!videoRef.current || !isActive || isDetecting) {
            return;
        }
        setIsDetecting(true);
        setErrorMessage('');

        const barcodeDetector = new window.BarcodeDetector();
        try {
            const detectedBarcodes = await barcodeDetector.detect(videoRef.current);
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
        stopCamera();
        appendMessage('Камера остановлена.');
    };

    const handleStart = async () => {
        const started = await startCamera();
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

            <Stack direction="row" spacing={2} marginTop={2}>
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
                    <Button variant="contained" color="success" onClick={handleStart} disabled={isStarting}>
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
};
