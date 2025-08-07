'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Stack } from '@mui/material';
import { BarcodePrint } from './BarcodePrint';
import useBarcodeSupported from './useBarcodeSupported';

// Определение типа для BarcodeDetector API
interface BarcodeDetectorInterface {
    getSupportedFormats(): Promise<string[]>;
    detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>;
}

interface DetectedBarcode {
    boundingBox: DOMRectReadOnly;
    rawValue: string;
    format: string;
    cornerPoints: { x: number; y: number }[];
}

// Параметры конструктора BarcodeDetector
interface BarcodeDetectorOptions {
    formats: string[];
}

declare global {
    interface Window {
        BarcodeDetector: {
            new (options?: BarcodeDetectorOptions): BarcodeDetectorInterface;
            getSupportedFormats(): Promise<string[]>;
        };
    }
}

export const BarcodeDetect = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const [barcodes, setBarcodes] = useState<DetectedBarcode[]>([]);
    const [messages, setMessages] = useState('');
    const [isActive, setIsActive] = useState(true);

    const [isSupported] = useBarcodeSupported();

    useEffect(() => {
        async function getMedia() {
            if (videoRef.current) {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' },
                    audio: false,
                });
                videoRef.current.srcObject = stream;
            }
        }

        getMedia();

        // Сохраняем текущее значение videoRef.current
        const videoElement = videoRef.current;

        return () => {
            if (videoElement && isActive) {
                const stream = videoElement.srcObject as MediaStream;
                const tracks = stream.getTracks();
                tracks.forEach((track) => track.stop());
                videoElement.srcObject = null;
            }
        };
    }, [isActive]);

    const handleDetect = async () => {
        // create new detector
        const barcodeDetector = new window.BarcodeDetector();

        // detect barcodes
        if (videoRef.current) {
            // Perform barcode detection with error handling
            let detectedBarcodes: DetectedBarcode[] = [];
            try {
                detectedBarcodes = await barcodeDetector.detect(videoRef.current);
            } catch (err) {
                setMessages((prev) => `${prev}${prev ? '\n' : ''}Detection error: ${(err as Error).message}`);
                return;
            }

            setMessages((prev) => prev + '\n' + 'Barcodes detected: ' + detectedBarcodes.length);
            setBarcodes(detectedBarcodes);
        }
    };

    const handleStop = () => {
        if (videoRef.current && isActive) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            setIsActive(false);
        }
    };

    const handleStart = () => {
        async function getMedia() {
            if (videoRef.current) {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' },
                    audio: false,
                });
                videoRef.current.srcObject = stream;
            }
        }

        getMedia();
        setIsActive(true);
    };

    return (
        <div>
            {isSupported && (
                <div>
                    <video
                        ref={videoRef}
                        width="100%"
                        height="300"
                        playsInline
                        autoPlay
                        muted
                        style={{ objectFit: 'cover' }}
                    ></video>
                    <Stack direction="row" spacing={2} marginTop={2}>
                        {isActive ? (
                            <>
                                <Button variant="contained" color="error" onClick={handleStop}>
                                    Stop
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleDetect}>
                                    Detect Barcodes
                                </Button>
                            </>
                        ) : (
                            <Button variant="contained" color="success" onClick={handleStart}>
                                Start
                            </Button>
                        )}
                    </Stack>

                    <div style={{ marginTop: 2 }}>
                        {barcodes.map((barcode) => (
                            <div key={barcode.rawValue}>
                                <div>
                                    {barcode.format}: {barcode.rawValue}
                                </div>
                                <BarcodePrint barcode={barcode.rawValue} format={barcode.format} />
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: 2 }}>
                        <pre style={{ fontSize: 10 }}>{messages}</pre>
                    </div>
                </div>
            )}
        </div>
    );
};
