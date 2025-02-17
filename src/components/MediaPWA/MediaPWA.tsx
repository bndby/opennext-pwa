'use client';

import { useEffect, useRef } from "react";

export const MediaPWA = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        async function getMedia() {
            if (videoRef.current) {
                const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
                videoRef.current.srcObject = stream;
            }
        }

        getMedia();
        
    }, []);

    return (
        <div>
            <p>Media</p>
            <video ref={videoRef} width="100%" playsInline autoPlay muted></video>
        </div>
    )
}