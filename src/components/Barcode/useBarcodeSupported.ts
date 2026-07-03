import { useEffect, useState } from 'react';

export type BarcodeSupportResult = readonly [boolean, string[], boolean];

/**
 * Check if barcode API is supported
 * If supported, return boolean and supported formats
 * If not supported, return false and empty array
 *
 * @returns [isSupported, supportedFormats, isChecking]
 */
export default function useBarcodeSupported(): BarcodeSupportResult {
    const [isSupported, setIsSupported] = useState(false);
    const [supportedFormats, setSupportedFormats] = useState<string[]>([]);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if ('BarcodeDetector' in window && typeof window.BarcodeDetector.getSupportedFormats === 'function') {
            setIsSupported(true);
            window.BarcodeDetector.getSupportedFormats()
                .then((formats: string[]) => setSupportedFormats(formats))
                .catch(() => setSupportedFormats([]))
                .finally(() => setIsChecking(false));
        } else {
            setIsSupported(false);
            setSupportedFormats([]);
            setIsChecking(false);
        }
    }, []);

    return [isSupported, supportedFormats, isChecking] as const;
}
