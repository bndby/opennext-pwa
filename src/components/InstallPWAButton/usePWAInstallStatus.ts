'use client';

import { useEffect, useState } from 'react';

// Расширяем интерфейс Navigator для поддержки standalone свойства
declare global {
    interface Navigator {
        standalone?: boolean;
    }
}

export type PWAInstallStatus =
    | 'checking' // Проверяем статус
    | 'installed' // Приложение уже установлено
    | 'installable' // Доступно для установки
    | 'not-supported' // Браузер не поддерживает PWA
    | 'not-installable'; // PWA не готово к установке

export type DevicePlatform = 'desktop' | 'mobile' | 'tablet' | 'unknown';

// Функция для определения типа устройства
function detectDevicePlatform(): DevicePlatform {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobi)/i.test(userAgent);

    if (isTablet) return 'tablet';
    if (isMobile) return 'mobile';

    // Дополнительные проверки для десктопа
    const isDesktop =
        !isMobile &&
        !isTablet &&
        (userAgent.includes('windows') ||
            userAgent.includes('macintosh') ||
            userAgent.includes('linux') ||
            window.screen.width >= 1024);

    return isDesktop ? 'desktop' : 'unknown';
}

// Функция для определения поддержки PWA в зависимости от браузера на десктопе
function getDesktopBrowserSupport(): { supported: boolean; recommendation?: string } {
    const userAgent = navigator.userAgent.toLowerCase();

    // Chrome и браузеры на базе Chromium (Edge, Brave, Opera)
    if (
        userAgent.includes('chrome') ||
        userAgent.includes('chromium') ||
        userAgent.includes('edg/') ||
        userAgent.includes('brave') ||
        userAgent.includes('opera')
    ) {
        return { supported: true };
    }

    // Firefox на десктопе (ограниченная поддержка)
    if (userAgent.includes('firefox')) {
        return {
            supported: false,
            recommendation: 'Firefox имеет ограниченную поддержку PWA. Рекомендуем Chrome или Edge для лучшего опыта',
        };
    }

    // Safari на macOS (ограниченная поддержка)
    if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
        return {
            supported: false,
            recommendation: 'Safari имеет ограниченную поддержку PWA на macOS. Рекомендуем Chrome или Edge',
        };
    }

    return {
        supported: false,
        recommendation: 'Для установки PWA рекомендуем использовать Chrome или Microsoft Edge',
    };
}

export function usePWAInstallStatus() {
    const [status, setStatus] = useState<PWAInstallStatus>('checking');
    const [isClient, setIsClient] = useState(false);
    const [platform, setPlatform] = useState<DevicePlatform>('unknown');
    const [browserRecommendation, setBrowserRecommendation] = useState<string>('');

    useEffect(() => {
        setIsClient(true);
        const detectedPlatform = detectDevicePlatform();
        setPlatform(detectedPlatform);

        // Проверяем поддержку браузера для десктопа
        if (detectedPlatform === 'desktop') {
            const browserSupport = getDesktopBrowserSupport();
            if (browserSupport.recommendation) {
                setBrowserRecommendation(browserSupport.recommendation);
            }
        }
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const checkInstallStatus = () => {
            // Проверяем, запущено ли приложение в standalone режиме
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

            // Проверяем для iOS Safari
            const isIOSStandalone = 'standalone' in window.navigator && window.navigator.standalone === true;

            // Дополнительная проверка для Android WebView
            const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
            const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;

            // Проверяем referrer для PWA режима
            const referrerCheck = document.referrer === '' || document.referrer.includes('android-app://');

            const isPWAMode = isStandalone || isIOSStandalone || isMinimalUI || isFullscreen || referrerCheck;

            if (isPWAMode) {
                setStatus('installed');
                return;
            }

            // Проверяем базовую поддержку PWA
            const hasServiceWorkerSupport = 'serviceWorker' in navigator;

            if (!hasServiceWorkerSupport) {
                setStatus('not-supported');
                return;
            }

            // Проверяем наличие beforeinstallprompt события
            let hasInstallPrompt = false;
            let installPromptHandled = false;

            const handleBeforeInstallPrompt = (e: Event) => {
                e.preventDefault(); // Предотвращаем автоматический показ браузером
                hasInstallPrompt = true;
                installPromptHandled = true;
                setStatus('installable');
            };

            const handleAppInstalled = () => {
                setStatus('installed');
            };

            // Слушаем события установки
            window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.addEventListener('appinstalled', handleAppInstalled);

            // Проверяем через манифест и другие признаки
            const checkAdvancedCriteria = async () => {
                // Проверяем наличие манифеста
                const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
                if (!manifestLink) {
                    if (!installPromptHandled) {
                        setStatus('not-installable');
                    }
                    return;
                }

                // Проверяем HTTPS (кроме localhost)
                const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
                if (!isHTTPS) {
                    if (!installPromptHandled) {
                        setStatus('not-installable');
                    }
                    return;
                }

                // Если через некоторое время событие не пришло, проверяем другие критерии
                setTimeout(() => {
                    if (!hasInstallPrompt && !installPromptHandled) {
                        // Возможно приложение уже было установлено или не соответствует критериям
                        setStatus('not-installable');
                    }
                }, 2000);
            };

            checkAdvancedCriteria();

            return () => {
                window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
                window.removeEventListener('appinstalled', handleAppInstalled);
            };
        };

        const cleanup = checkInstallStatus();
        return cleanup;
    }, [isClient]);

    // Функция для получения текстового описания статуса с учетом платформы
    const getStatusText = (): string => {
        const isDesktop = platform === 'desktop';

        switch (status) {
            case 'checking':
                return 'Проверяем возможность установки...';
            case 'installed':
                return isDesktop
                    ? 'Приложение установлено и запущено как настольное приложение'
                    : 'Приложение уже установлено';
            case 'installable':
                return isDesktop
                    ? 'Приложение можно установить на компьютер как настольное приложение'
                    : 'Приложение можно установить на главный экран';
            case 'not-supported':
                return isDesktop
                    ? 'Ваш браузер не поддерживает установку PWA. Попробуйте Chrome или Edge'
                    : 'Браузер не поддерживает установку PWA';
            case 'not-installable':
                return isDesktop
                    ? 'Приложение не готово к установке на компьютер. Возможно, оно уже было установлено'
                    : 'Приложение не готово к установке';
            default:
                return 'Неизвестный статус';
        }
    };

    return {
        status,
        statusText: getStatusText(),
        platform,
        browserRecommendation,
        isInstalled: status === 'installed',
        isInstallable: status === 'installable',
        isSupported: status !== 'not-supported',
        isChecking: status === 'checking',
        isDesktop: platform === 'desktop',
        isMobile: platform === 'mobile',
        isTablet: platform === 'tablet',
    };
}
