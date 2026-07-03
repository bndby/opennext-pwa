export interface DetectedBarcode {
    boundingBox: DOMRectReadOnly;
    rawValue: string;
    format: string;
    cornerPoints: { x: number; y: number }[];
}

export interface BarcodeDetectorInterface {
    detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>;
}

export interface BarcodeDetectorConstructor {
    new (options?: BarcodeDetectorOptions): BarcodeDetectorInterface;
    getSupportedFormats(): Promise<string[]>;
}

export interface BarcodeDetectorOptions {
    formats: string[];
}

declare global {
    interface Window {
        BarcodeDetector: BarcodeDetectorConstructor;
    }
}
