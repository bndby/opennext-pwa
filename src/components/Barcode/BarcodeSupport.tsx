'use client';

import { Chip } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
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

export default function BarcodeSupport() {
    const [isSupported, supportedFormats] = useBarcodeSupported();

    return (
        <div>
            {isSupported ? (
                <Chip icon={<ThumbUpIcon />} label={`Supported: ${supportedFormats.length}`} color="success" />
            ) : (
                <Chip icon={<ThumbDownIcon />} label="Not Supported" color="error" />
            )}
        </div>
    );
}
