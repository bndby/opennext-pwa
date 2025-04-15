'use client';

import { useEffect, useState } from 'react';
import { Chip } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

export default function ContactsSupport() {
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if ('contacts' in navigator && 'ContactsManager' in window) {
            setIsSupported(true);
        }
    }, []);

    return (
        <div>
            {isSupported ? (
                <Chip icon={<ThumbUpIcon />} label="Supported" color="success" />
            ) : (
                <Chip icon={<ThumbDownIcon />} label="Not Supported" color="error" />
            )}
        </div>
    );
}
