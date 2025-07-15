import { useEffect, useState } from 'react';

type BarcodeSupportResult = readonly [boolean, string[]];

/**
 * Check if barcode API is supported
 * If supported, return boolean and supported formats
 * If not supported, return false and empty array
 *
 * @returns [isSupported, supportedFormats]
 */
export default function useBarcodeSupported(): BarcodeSupportResult {
    const [isSupported, setIsSupported] = useState(false);
    const [supportedFormats, setSupportedFormats] = useState<string[]>([]);

    useEffect(() => {
        if ('BarcodeDetector' in window && typeof window.BarcodeDetector.getSupportedFormats === 'function') {
            setIsSupported(true);
            window.BarcodeDetector.getSupportedFormats()
                .then((formats: string[]) => setSupportedFormats(formats))
                .catch(() => setSupportedFormats([]));
        } else {
            setIsSupported(false);
            setSupportedFormats([]);
        }
    }, []);

    return [isSupported, supportedFormats] as const;
}
