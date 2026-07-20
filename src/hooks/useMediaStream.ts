'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type UseMediaStreamOptions = MediaStreamConstraints;

export type UseMediaStreamResult = {
    stream: MediaStream | null;
    error: string;
    isActive: boolean;
    isStarting: boolean;
    isSupported: boolean;
    start: (constraints?: UseMediaStreamOptions) => Promise<boolean>;
    stop: () => void;
    attachTo: (video: HTMLVideoElement | null) => void;
};

function stopTracks(stream: MediaStream | null) {
    if (!stream) return;
    stream.getTracks().forEach((track) => track.stop());
}

/**
 * Хук для getUserMedia со стартом/стопом и cleanup при размонтировании.
 */
export function useMediaStream(
    defaultConstraints: UseMediaStreamOptions = { video: true, audio: false },
): UseMediaStreamResult {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    const streamRef = useRef<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const defaultConstraintsRef = useRef(defaultConstraints);
    const isStartingRef = useRef(false);

    useEffect(() => {
        defaultConstraintsRef.current = defaultConstraints;
    }, [defaultConstraints]);

    useEffect(() => {
        setIsSupported(!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
    }, []);

    const attachTo = useCallback((video: HTMLVideoElement | null) => {
        videoRef.current = video;
        if (video && streamRef.current) {
            video.srcObject = streamRef.current;
        }
    }, []);

    const stop = useCallback(() => {
        stopTracks(streamRef.current);
        streamRef.current = null;
        setStream(null);
        setIsActive(false);

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, []);

    const start = useCallback(async (constraints?: UseMediaStreamOptions): Promise<boolean> => {
        if (isStartingRef.current) return false;

        if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            setError('MediaDevices API не поддерживается в вашем браузере');
            return false;
        }

        isStartingRef.current = true;
        setIsStarting(true);
        setError('');

        try {
            stopTracks(streamRef.current);

            const mediaStream = await navigator.mediaDevices.getUserMedia(
                constraints ?? defaultConstraintsRef.current,
            );

            streamRef.current = mediaStream;
            setStream(mediaStream);
            setIsActive(true);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }

            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
            setError(`Ошибка доступа к камере/микрофону: ${message}`);
            setIsActive(false);
            streamRef.current = null;
            setStream(null);
            return false;
        } finally {
            isStartingRef.current = false;
            setIsStarting(false);
        }
    }, []);

    useEffect(() => {
        return () => {
            stopTracks(streamRef.current);
            streamRef.current = null;
        };
    }, []);

    return {
        stream,
        error,
        isActive,
        isStarting,
        isSupported,
        start,
        stop,
        attachTo,
    };
}
