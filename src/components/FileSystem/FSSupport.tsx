'use client';

import { useState, useEffect } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { Chip } from '@mui/material';

export default function FSSupport() {
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if ('showOpenFilePicker' in self) {
            setIsSupported(true);
        }
    }, []);

    return (
        <div>
            {isSupported ? (
                <Chip icon={<ThumbUpIcon />} label="Supported" color="success" />
            ) : (
                <Chip icon={<ThumbDownIcon />} label="Not supported" color="error" />
            )}
        </div>
    );
}
