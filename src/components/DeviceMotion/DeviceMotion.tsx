'use client';

import React, { useEffect, useState } from 'react';
import { RadarChart } from '@mui/x-charts/RadarChart';

export default function DeviceMotion() {
    const [xData, setXData] = useState<number>(0);
    const [yData, setYData] = useState<number>(0);
    const [zData, setZData] = useState<number>(0);

    const [alpha, setAlpha] = useState<number>(0);
    const [beta, setBeta] = useState<number>(0);
    const [gamma, setGamma] = useState<number>(0);

    useEffect(() => {
        const handleDeviceMotion = (event: DeviceMotionEvent) => {
            setXData(event.acceleration?.x ?? 0);
            setYData(event.acceleration?.y ?? 0);
            setZData(event.acceleration?.z ?? 0);
        };

        const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
            // Получаем углы в градусах и нормализуем их
            // Alpha: 0° до 360° (поворот вокруг оси Z)
            // Beta: -180° до 180° (наклон вперед/назад)
            // Gamma: -90° до 90° (наклон влево/вправо)

            // Проверяем, что углы не null и находятся в правильном диапазоне
            const alpha = event.alpha ?? 0;
            const beta = event.beta ?? 0;
            const gamma = event.gamma ?? 0;

            setAlpha(alpha);
            setBeta(beta);
            setGamma(gamma);

            // Отладочная информация
            console.log('DeviceOrientation:', { alpha, beta, gamma });
        };

        window.addEventListener('devicemotion', handleDeviceMotion);
        window.addEventListener('deviceorientation', handleDeviceOrientation);

        return () => {
            window.removeEventListener('devicemotion', handleDeviceMotion);
            window.removeEventListener('deviceorientation', handleDeviceOrientation);
        };
    }, []);

    // Функция для создания 3D-трансформации
    const create3DTransform = () => {
        // Конвертируем градусы в радианы
        const alphaRad = (alpha * Math.PI) / 180;
        const betaRad = (beta * Math.PI) / 180;
        const gammaRad = (gamma * Math.PI) / 180;

        // Создаем матрицу поворота для каждой оси
        // Alpha (Z) - поворот вокруг вертикальной оси (как компас)
        const cosZ = Math.cos(alphaRad);
        const sinZ = Math.sin(alphaRad);

        // Beta (X) - наклон вперед/назад (к себе/от себя)
        const cosX = Math.cos(betaRad);
        const sinX = Math.sin(betaRad);

        // Gamma (Y) - наклон влево/вправо
        const cosY = Math.cos(gammaRad);
        const sinY = Math.sin(gammaRad);

        // Правильная матрица поворота: сначала Z (Alpha), потом X (Beta), потом Y (Gamma)
        // Alpha (Z) - поворот как компас, Beta (X) - наклон к себе/от себя, Gamma (Y) - наклон влево/вправо
        // Применяем повороты в порядке: Rz(alpha) * Rx(beta) * Ry(gamma)
        const matrix = [
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

        return matrix;
    };

    const matrix = create3DTransform();

    // Функция для трансформации 3D-точки
    const transformPoint = (x: number, y: number, z: number) => {
        const newX = matrix[0] * x + matrix[1] * y + matrix[2] * z;
        const newY = matrix[3] * x + matrix[4] * y + matrix[5] * z;
        const newZ = matrix[6] * x + matrix[7] * y + matrix[8] * z;

        // Проекция 3D в 2D с перспективой
        const perspective = 200;
        const scale = perspective / (perspective + newZ);

        return {
            x: newX * scale + 150,
            y: newY * scale + 100,
        };
    };

    // Точки параллелепипеда - исправленные координаты для правильного совпадения граней
    const points = {
        // Передняя грань (z = 20)
        front: [
            { x: -40, y: -30, z: 20 },
            { x: 40, y: -30, z: 20 },
            { x: 40, y: 30, z: 20 },
            { x: -40, y: 30, z: 20 },
        ],
        // Задняя грань (z = -20)
        back: [
            { x: -40, y: -30, z: -20 },
            { x: 40, y: -30, z: -20 },
            { x: 40, y: 30, z: -20 },
            { x: -40, y: 30, z: -20 },
        ],
        // Правая грань (x = 40)
        right: [
            { x: 40, y: -30, z: -20 },
            { x: 40, y: -30, z: 20 },
            { x: 40, y: 30, z: 20 },
            { x: 40, y: 30, z: -20 },
        ],
        // Левая грань (x = -40)
        left: [
            { x: -40, y: -30, z: -20 },
            { x: -40, y: -30, z: 20 },
            { x: -40, y: 30, z: 20 },
            { x: -40, y: 30, z: -20 },
        ],
        // Верхняя грань (y = -30)
        top: [
            { x: -40, y: -30, z: -20 },
            { x: 40, y: -30, z: -20 },
            { x: 40, y: -30, z: 20 },
            { x: -40, y: -30, z: 20 },
        ],
        // Нижняя грань (y = 30)
        bottom: [
            { x: -40, y: 30, z: -20 },
            { x: 40, y: 30, z: -20 },
            { x: 40, y: 30, z: 20 },
            { x: -40, y: 30, z: 20 },
        ],
    };

    // Трансформируем все точки
    const transformedPoints = {
        front: points.front.map((p) => transformPoint(p.x, p.y, p.z)),
        back: points.back.map((p) => transformPoint(p.x, p.y, p.z)),
        right: points.right.map((p) => transformPoint(p.x, p.y, p.z)),
        left: points.left.map((p) => transformPoint(p.x, p.y, p.z)),
        top: points.top.map((p) => transformPoint(p.x, p.y, p.z)),
        bottom: points.bottom.map((p) => transformPoint(p.x, p.y, p.z)),
    };

    // Функция для создания SVG-полигон из точек
    const createPolygon = (points: { x: number; y: number }[]) => {
        return points.map((p) => `${p.x},${p.y}`).join(' ');
    };

    // Функция для вычисления средней Z-координаты грани (для сортировки по глубине)
    const getFaceDepth = (facePoints: { x: number; y: number; z: number }[]) => {
        const avgZ = facePoints.reduce((sum, p) => sum + p.z, 0) / facePoints.length;
        return avgZ;
    };

    // Сортируем грани по глубине (от дальних к ближним)
    const sortedFaces = [
        { name: 'back', points: points.back, transformed: transformedPoints.back, depth: getFaceDepth(points.back) },
        { name: 'left', points: points.left, transformed: transformedPoints.left, depth: getFaceDepth(points.left) },
        {
            name: 'right',
            points: points.right,
            transformed: transformedPoints.right,
            depth: getFaceDepth(points.right),
        },
        {
            name: 'bottom',
            points: points.bottom,
            transformed: transformedPoints.bottom,
            depth: getFaceDepth(points.bottom),
        },
        { name: 'top', points: points.top, transformed: transformedPoints.top, depth: getFaceDepth(points.top) },
        {
            name: 'front',
            points: points.front,
            transformed: transformedPoints.front,
            depth: getFaceDepth(points.front),
        },
    ].sort((a, b) => a.depth - b.depth);

    return (
        <div>
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
                    {/* Определяем градиенты для граней */}
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

                    {/* Рисуем грани в порядке от дальних к ближним для правильного перекрытия */}
                    {sortedFaces.map((face) => {
                        let fill, stroke, strokeWidth, opacity;

                        switch (face.name) {
                            case 'back':
                                fill = '#666666';
                                stroke = '#333333';
                                strokeWidth = 1;
                                opacity = 0.5;
                                break;
                            case 'left':
                                fill = 'url(#leftGradient)';
                                stroke = '#7B1FA2';
                                strokeWidth = 1;
                                opacity = 1;
                                break;
                            case 'right':
                                fill = 'url(#rightGradient)';
                                stroke = '#F57C00';
                                strokeWidth = 1;
                                opacity = 1;
                                break;
                            case 'bottom':
                                fill = 'url(#bottomGradient)';
                                stroke = '#5D4037';
                                strokeWidth = 1;
                                opacity = 1;
                                break;
                            case 'top':
                                fill = 'url(#topGradient)';
                                stroke = '#2E7D32';
                                strokeWidth = 1;
                                opacity = 1;
                                break;
                            case 'front':
                                fill = 'url(#frontGradient)';
                                stroke = '#1565C0';
                                strokeWidth = 2;
                                opacity = 1;
                                break;
                            default:
                                fill = '#999';
                                stroke = '#666';
                                strokeWidth = 1;
                                opacity = 1;
                        }

                        return (
                            <polygon
                                key={face.name}
                                points={createPolygon(face.transformed)}
                                fill={fill}
                                stroke={stroke}
                                strokeWidth={strokeWidth}
                                opacity={opacity}
                            />
                        );
                    })}
                </svg>
            </div>

            {/* Текст с информацией об ориентации */}
            <div style={{ marginTop: '20px', textAlign: 'center', fontFamily: 'monospace' }}>
                <div>Alpha (Z): {Math.round(alpha)}° - поворот как компас</div>
                <div>Beta (X): {Math.round(beta)}° - наклон к себе/от себя</div>
                <div>Gamma (Y): {Math.round(gamma)}° - наклон влево/вправо</div>
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                    Поверните телефон, чтобы увидеть 3D-трансформацию
                </div>
            </div>
        </div>
    );
}
