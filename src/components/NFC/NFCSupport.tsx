'use client';

import { useEffect, useState } from 'react';

export default function NFCSupport() {
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if ('NDEFReader' in window) {
            setIsSupported(true);
        }
    }, []);

    return (
        <div>
            <p>NFC Support: {isSupported ? 'Supported' : 'Not Supported'}</p>
        </div>
    );
}
