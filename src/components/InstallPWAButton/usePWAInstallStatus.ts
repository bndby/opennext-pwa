'use client';

import { useEffect, useState } from 'react';
import type { IBeforeInstallPromptEvent } from './useAddToHomescreenPrompt';

declare global {
    interface Navigator {
        standalone?: boolean;
    }
}

export type PWAInstallStatus =
    | 'checking'
    | 'installed'
    | 'installable'
    | 'not-supported'
    | 'not-installable';

export type DevicePlatform = 'desktop' | 'mobile' | 'tablet' | 'unknown';

function detectDevicePlatform(): DevicePlatform {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobi)/i.test(userAgent);

    if (isTablet) return 'tablet';
    if (isMobile) return 'mobile';

    const isDesktop =
        !isMobile &&
        !isTablet &&
        (userAgent.includes('windows') ||
            userAgent.includes('macintosh') ||
            userAgent.includes('linux') ||
            window.screen.width >= 1024);

    return isDesktop ? 'desktop' : 'unknown';
}

function getDesktopBrowserSupport(): { supported: boolean; recommendation?: string } {
    const userAgent = navigator.userAgent.toLowerCase();

    if (
        userAgent.includes('chrome') ||
        userAgent.includes('chromium') ||
        userAgent.includes('edg/') ||
        userAgent.includes('brave') ||
        userAgent.includes('opera')
    ) {
        return { supported: true };
    }

    if (userAgent.includes('firefox')) {
        return {
            supported: false,
            recommendation: 'Firefox имеет ограниченную поддержку PWA. Рекомендуем Chrome или Edge для лучшего опыта',
        };
    }

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

function isRunningAsPwa(): boolean {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = 'standalone' in window.navigator && window.navigator.standalone === true;
    const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
    // Только явный Android TWA referrer — пустой referrer НЕ считать признаком PWA
    const isAndroidTwa = document.referrer.includes('android-app://');

    return isStandalone || isIOSStandalone || isMinimalUI || isFullscreen || isAndroidTwa;
}

/**
 * Статус установки PWA.
 * @param promptEvent — событие из useAddToHomescreenPrompt (единый слушатель)
 */
export function usePWAInstallStatus(promptEvent: IBeforeInstallPromptEvent | null = null) {
    const [status, setStatus] = useState<PWAInstallStatus>('checking');
    const [isClient, setIsClient] = useState(false);
    const [platform, setPlatform] = useState<DevicePlatform>('unknown');
    const [browserRecommendation, setBrowserRecommendation] = useState<string>('');

    useEffect(() => {
        setIsClient(true);
        const detectedPlatform = detectDevicePlatform();
        setPlatform(detectedPlatform);

        if (detectedPlatform === 'desktop') {
            const browserSupport = getDesktopBrowserSupport();
            if (browserSupport.recommendation) {
                setBrowserRecommendation(browserSupport.recommendation);
            }
        }
    }, []);

    useEffect(() => {
        if (!isClient) return;

        if (isRunningAsPwa()) {
            setStatus('installed');
            return;
        }

        if (!('serviceWorker' in navigator)) {
            setStatus('not-supported');
            return;
        }

        if (promptEvent) {
            setStatus('installable');
            return;
        }

        const onInstalled = () => {
            setStatus('installed');
        };

        window.addEventListener('appinstalled', onInstalled);

        // Даём время на beforeinstallprompt; если не пришёл — not-installable
        const timer = window.setTimeout(() => {
            if (isRunningAsPwa()) return;
            setStatus((current) => {
                if (current === 'installable' || current === 'installed' || current === 'not-supported') {
                    return current;
                }
                return 'not-installable';
            });
        }, 2000);

        return () => {
            window.clearTimeout(timer);
            window.removeEventListener('appinstalled', onInstalled);
        };
    }, [isClient, promptEvent]);

    // Когда prompt появляется позже — сразу installable
    useEffect(() => {
        if (!isClient || !promptEvent) return;
        if (isRunningAsPwa()) return;
        setStatus('installable');
    }, [isClient, promptEvent]);

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
