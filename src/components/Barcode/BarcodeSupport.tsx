'use client';

import { Chip } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import useBarcodeSupported from './useBarcodeSupported';

export default function BarcodeSupport() {
    const [isSupported, supportedFormats, isChecking] = useBarcodeSupported();

    return (
        <div>
            {isChecking ? (
                <Chip icon={<HourglassTopIcon />} label="Проверяем поддержку API..." color="default" />
            ) : isSupported ? (
                <Chip
                    icon={<ThumbUpIcon />}
                    label={`API поддерживается, форматов: ${supportedFormats.length}`}
                    color="success"
                />
            ) : (
                <Chip icon={<ThumbDownIcon />} label="Barcode Detection API не поддерживается" color="error" />
            )}
        </div>
    );
}
