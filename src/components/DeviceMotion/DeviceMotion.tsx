'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { RadarChart } from '@mui/x-charts/RadarChart';
import { Alert, Button, Stack } from '@mui/material';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { usePermissionRequest } from '@/hooks/usePermissionRequest';

type DeviceMotionEventWithPermission = typeof DeviceMotionEvent & {
    requestPermission?: () => Promise<'granted' | 'denied'>;
};

type DeviceOrientationEventWithPermission = typeof DeviceOrientationEvent & {
    requestPermission?: () => Promise<'granted' | 'denied'>;
};

function createRotationMatrix(alpha: number, beta: number, gamma: number): number[] {
    const alphaRad = (alpha * Math.PI) / 180;
    const betaRad = (beta * Math.PI) / 180;
    const gammaRad = (gamma * Math.PI) / 180;

    const cosZ = Math.cos(alphaRad);
    const sinZ = Math.sin(alphaRad);
    const cosX = Math.cos(betaRad);
    const sinX = Math.sin(betaRad);
    const cosY = Math.cos(gammaRad);
    const sinY = Math.sin(gammaRad);

    return [
        cosZ * cosY - sinZ * sinX * sinY,
        -sinZ * cosX,
        sinZ * sinX * cosY + cosZ * sinY,
        sinZ * cosY + cosZ * sinX * sinY,
        cosZ * cosX,
        -cosZ * sinX * cosY + sinZ * sinY,
        -cosX * sinY,
        sinX,
        cosX * cosY,
    ];
}

function projectPoint(matrix: number[], x: number, y: number, z: number) {
    const newX = matrix[0] * x + matrix[1] * y + matrix[2] * z;
    const newY = matrix[3] * x + matrix[4] * y + matrix[5] * z;
    const newZ = matrix[6] * x + matrix[7] * y + matrix[8] * z;

    const perspective = 200;
    const scale = perspective / (perspective + newZ);

    return {
        x: newX * scale + 150,
        y: newY * scale + 100,
        z: newZ,
    };
}

function DeviceMotionInner() {
    const [xData, setXData] = useState(0);
    const [yData, setYData] = useState(0);
    const [zData, setZData] = useState(0);
    const [alpha, setAlpha] = useState(0);
    const [beta, setBeta] = useState(0);
    const [gamma, setGamma] = useState(0);
    const [ready, setReady] = useState(false);
    const { status: permissionStatus, request } = usePermissionRequest();

    const cleanupRef = useRef<(() => void) | null>(null);

    const needsPermission =
        typeof window !== 'undefined' &&
        typeof DeviceMotionEvent !== 'undefined' &&
        typeof (DeviceMotionEvent as DeviceMotionEventWithPermission).requestPermission === 'function';

    const attachListeners = useCallback(() => {
        cleanupRef.current?.();

        const handleDeviceMotion = (event: DeviceMotionEvent) => {
            setXData(event.acceleration?.x ?? 0);
            setYData(event.acceleration?.y ?? 0);
            setZData(event.acceleration?.z ?? 0);
        };

        const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
            setAlpha(event.alpha ?? 0);
            setBeta(event.beta ?? 0);
            setGamma(event.gamma ?? 0);
        };

        window.addEventListener('devicemotion', handleDeviceMotion);
        window.addEventListener('deviceorientation', handleDeviceOrientation);
        setReady(true);

        cleanupRef.current = () => {
            window.removeEventListener('devicemotion', handleDeviceMotion);
            window.removeEventListener('deviceorientation', handleDeviceOrientation);
        };
    }, []);

    useEffect(() => {
        if (needsPermission) {
            return;
        }

        attachListeners();

        return () => {
            cleanupRef.current?.();
            cleanupRef.current = null;
        };
    }, [needsPermission, attachListeners]);

    useEffect(() => {
        return () => {
            cleanupRef.current?.();
            cleanupRef.current = null;
        };
    }, []);

    const requestPermission = async () => {
        const motionResult = await request(DeviceMotionEvent as DeviceMotionEventWithPermission);
        if (motionResult === 'denied' || motionResult === 'error') {
            return;
        }

        const orientationResult = await request(DeviceOrientationEvent as DeviceOrientationEventWithPermission);
        if (orientationResult === 'denied' || orientationResult === 'error') {
            return;
        }

        attachListeners();
    };

    const matrix = createRotationMatrix(alpha, beta, gamma);

    const points = {
        front: [
            { x: -40, y: -30, z: 20 },
            { x: 40, y: -30, z: 20 },
            { x: 40, y: 30, z: 20 },
            { x: -40, y: 30, z: 20 },
        ],
        back: [
            { x: -40, y: -30, z: -20 },
            { x: 40, y: -30, z: -20 },
            { x: 40, y: 30, z: -20 },
            { x: -40, y: 30, z: -20 },
        ],
        right: [
            { x: 40, y: -30, z: -20 },
            { x: 40, y: -30, z: 20 },
            { x: 40, y: 30, z: 20 },
            { x: 40, y: 30, z: -20 },
        ],
        left: [
            { x: -40, y: -30, z: -20 },
            { x: -40, y: -30, z: 20 },
            { x: -40, y: 30, z: 20 },
            { x: -40, y: 30, z: -20 },
        ],
        top: [
            { x: -40, y: -30, z: -20 },
            { x: 40, y: -30, z: -20 },
            { x: 40, y: -30, z: 20 },
            { x: -40, y: -30, z: 20 },
        ],
        bottom: [
            { x: -40, y: 30, z: -20 },
            { x: 40, y: 30, z: -20 },
            { x: 40, y: 30, z: 20 },
            { x: -40, y: 30, z: 20 },
        ],
    };

    const transformed = {
        front: points.front.map((p) => projectPoint(matrix, p.x, p.y, p.z)),
        back: points.back.map((p) => projectPoint(matrix, p.x, p.y, p.z)),
        right: points.right.map((p) => projectPoint(matrix, p.x, p.y, p.z)),
        left: points.left.map((p) => projectPoint(matrix, p.x, p.y, p.z)),
        top: points.top.map((p) => projectPoint(matrix, p.x, p.y, p.z)),
        bottom: points.bottom.map((p) => projectPoint(matrix, p.x, p.y, p.z)),
    };

    const avgZ = (face: { z: number }[]) => face.reduce((sum, p) => sum + p.z, 0) / face.length;

    const sortedFaces = (
        [
            { name: 'back', transformed: transformed.back },
            { name: 'left', transformed: transformed.left },
            { name: 'right', transformed: transformed.right },
            { name: 'bottom', transformed: transformed.bottom },
            { name: 'top', transformed: transformed.top },
            { name: 'front', transformed: transformed.front },
        ] as const
    )
        .map((face) => ({ ...face, depth: avgZ(face.transformed) }))
        .sort((a, b) => a.depth - b.depth);

    const createPolygon = (facePoints: { x: number; y: number }[]) =>
        facePoints.map((p) => `${p.x},${p.y}`).join(' ');

    const faceStyles: Record<string, { fill: string; stroke: string; strokeWidth: number; opacity: number }> = {
        back: { fill: '#666666', stroke: '#333333', strokeWidth: 1, opacity: 0.5 },
        left: { fill: 'url(#leftGradient)', stroke: '#7B1FA2', strokeWidth: 1, opacity: 1 },
        right: { fill: 'url(#rightGradient)', stroke: '#F57C00', strokeWidth: 1, opacity: 1 },
        bottom: { fill: 'url(#bottomGradient)', stroke: '#5D4037', strokeWidth: 1, opacity: 1 },
        top: { fill: 'url(#topGradient)', stroke: '#2E7D32', strokeWidth: 1, opacity: 1 },
        front: { fill: 'url(#frontGradient)', stroke: '#1565C0', strokeWidth: 2, opacity: 1 },
    };

    const showPermissionButton = needsPermission && !ready;

    return (
        <div>
            {showPermissionButton && (
                <Stack spacing={1} sx={{ mb: 2 }}>
                    {(permissionStatus === 'denied' || permissionStatus === 'error') && (
                        <Alert severity="warning">Доступ к датчикам движения запрещён</Alert>
                    )}
                    <Button variant="contained" onClick={requestPermission}>
                        Разрешить доступ к акселерометру
                    </Button>
                </Stack>
            )}

            <RadarChart
                height={200}
                series={[{ label: 'Acceleration', data: [xData, yData, zData] }]}
                radar={{
                    max: 5,
                    metrics: ['X', 'Y', 'Z'],
                }}
            />
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <svg width="300" height="200" viewBox="0 0 300 200">
                    <defs>
                        <linearGradient id="topGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#4CAF50', stopOpacity: 0.8 }} />
                            <stop offset="100%" style={{ stopColor: '#2E7D32', stopOpacity: 0.8 }} />
                        </linearGradient>
                        <linearGradient id="frontGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#2196F3', stopOpacity: 0.7 }} />
                            <stop offset="100%" style={{ stopColor: '#1565C0', stopOpacity: 0.7 }} />
                        </linearGradient>
                        <linearGradient id="rightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#FF9800', stopOpacity: 0.6 }} />
                            <stop offset="100%" style={{ stopColor: '#F57C00', stopOpacity: 0.6 }} />
                        </linearGradient>
                        <linearGradient id="leftGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#9C27B0', stopOpacity: 0.6 }} />
                            <stop offset="100%" style={{ stopColor: '#7B1FA2', stopOpacity: 0.6 }} />
                        </linearGradient>
                        <linearGradient id="bottomGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#795548', stopOpacity: 0.6 }} />
                            <stop offset="100%" style={{ stopColor: '#5D4037', stopOpacity: 0.6 }} />
                        </linearGradient>
                    </defs>

                    {sortedFaces.map((face) => {
                        const style = faceStyles[face.name] ?? {
                            fill: '#999',
                            stroke: '#666',
                            strokeWidth: 1,
                            opacity: 1,
                        };
                        return (
                            <polygon
                                key={face.name}
                                points={createPolygon(face.transformed)}
                                fill={style.fill}
                                stroke={style.stroke}
                                strokeWidth={style.strokeWidth}
                                opacity={style.opacity}
                            />
                        );
                    })}
                </svg>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center', fontFamily: 'monospace' }}>
                <div>Alpha (Z): {Math.round(alpha)}° — поворот как компас</div>
                <div>Beta (X): {Math.round(beta)}° — наклон к себе/от себя</div>
                <div>Gamma (Y): {Math.round(gamma)}° — наклон влево/вправо</div>
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                    Поверните телефон, чтобы увидеть 3D-трансформацию
                </div>
            </div>
        </div>
    );
}

export default function DeviceMotion() {
    return (
        <ErrorBoundary title="Ошибка акселерометра">
            <DeviceMotionInner />
        </ErrorBoundary>
    );
}
