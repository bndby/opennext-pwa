'use client';

import { useState, useEffect } from 'react';

export default function FSSupport() {
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if ('showOpenFilePicker' in self) {
            setIsSupported(true);
        }
    }, []);

    return (
        <div>
            <p>{isSupported ? 'Supported' : 'Not supported'}</p>
        </div>
    );
}
