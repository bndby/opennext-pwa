'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Stack } from '@mui/material';
import { BarcodePrint } from './BarcodePrint';

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

        return () => {
            if (videoRef.current && isActive) {
                const stream = videoRef.current.srcObject as MediaStream;
                const tracks = stream.getTracks();
                tracks.forEach((track) => track.stop());
                videoRef.current.srcObject = null;
            }
        };
    }, []);

    const handleDetect = async () => {
        if (!('BarcodeDetector' in window)) {
            setMessages((prev) => prev + '\n' + 'Barcode Detector is not supported by this browser.');
        } else {
            setMessages((prev) => prev + '\n' + 'Barcode Detector supported!');

            // create new detector
            const barcodeDetector = new window.BarcodeDetector();

            // detect barcodes
            if (videoRef.current) {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                setMessages((prev) => prev + '\n' + 'Barcodes detected: ' + barcodes.length);
                setBarcodes(barcodes);
            }
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
    );
};
