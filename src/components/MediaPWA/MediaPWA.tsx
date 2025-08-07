'use client';

import { useEffect, useRef, useState } from 'react';

export const MediaPWA = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        async function getMedia() {
            try {
                if (videoRef.current) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    videoRef.current.srcObject = stream;
                    setError('');
                }
            } catch (err) {
                setError(
                    'Ошибка доступа к камере/микрофону: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'),
                );
            }
        }

        getMedia();
    }, []);

    return (
        <div>
            <p>Media</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <video ref={videoRef} width="100%" playsInline autoPlay muted></video>
        </div>
    );
};
