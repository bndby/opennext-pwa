'use client';

import { useEffect, useRef } from 'react';
import { useClientSide } from '@/hooks/useClientSide';
import { useMediaStream } from '@/hooks/useMediaStream';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';

function MediaPWAInner() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const isClient = useClientSide();
    const { error, isSupported, start, stop, attachTo, isStarting } = useMediaStream({
        video: true,
        audio: true,
    });

    useEffect(() => {
        attachTo(videoRef.current);
    }, [attachTo, isClient]);

    useEffect(() => {
        if (!isClient || !isSupported) return;

        void start();

        return () => {
            stop();
        };
    }, [isClient, isSupported, start, stop]);

    if (!isClient) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <p>Media</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isSupported && (
                <video ref={videoRef} width="100%" playsInline autoPlay muted aria-label="Предпросмотр камеры" />
            )}
            {!isSupported && <p style={{ color: 'red' }}>MediaDevices API не поддерживается в вашем браузере</p>}
            {isStarting && <p>Запрашиваем доступ к камере…</p>}
        </div>
    );
}

export const MediaPWA = () => (
    <ErrorBoundary title="Ошибка медиа">
        <MediaPWAInner />
    </ErrorBoundary>
);
