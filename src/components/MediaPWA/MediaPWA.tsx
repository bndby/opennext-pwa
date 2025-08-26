'use client';

import { useEffect, useRef, useState } from 'react';
import { useClientSide } from '@/hooks/useClientSide';

export const MediaPWA = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string>('');
    const isClient = useClientSide();
    const [isSupported, setIsSupported] = useState<boolean>(false);

    // Проверяем поддержку MediaDevices API
    useEffect(() => {
        if (isClient) {
            const supported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
            setIsSupported(supported);
        }
    }, [isClient]);

    useEffect(() => {
        async function getMedia() {
            if (!isSupported) {
                setError('MediaDevices API не поддерживается в вашем браузере');
                return;
            }

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

        if (isSupported) {
            getMedia();
        }
    }, [isSupported]);

    // Не рендерим ничего до монтирования на клиенте
    if (!isClient) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <p>Media</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isSupported && <video ref={videoRef} width="100%" playsInline autoPlay muted></video>}
            {!isSupported && <p style={{ color: 'red' }}>MediaDevices API не поддерживается в вашем браузере</p>}
        </div>
    );
};
