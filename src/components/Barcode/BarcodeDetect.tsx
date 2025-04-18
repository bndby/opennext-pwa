'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';

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

    useEffect(() => {
        async function getMedia() {
            if (videoRef.current) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                videoRef.current.srcObject = stream;
            }
        }

        getMedia();
    }, []);

    const handleDetect = async () => {
        if (!('BarcodeDetector' in window)) {
            console.log('Barcode Detector is not supported by this browser.');
        } else {
            console.log('Barcode Detector supported!');

            // create new detector
            const barcodeDetector = new window.BarcodeDetector({
                formats: ['code_39', 'codabar', 'ean_13'],
            });

            // detect barcodes
            if (videoRef.current) {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                console.log(barcodes);
                setBarcodes(barcodes);
            }
        }
    };

    return (
        <div>
            <video ref={videoRef} width="100%" playsInline autoPlay muted></video>
            <Button variant="contained" color="primary" onClick={handleDetect}>
                Detect Barcodes
            </Button>

            <div>
                {barcodes.map((barcode) => (
                    <div key={barcode.rawValue}>{barcode.rawValue}</div>
                ))}
            </div>
        </div>
    );
};
