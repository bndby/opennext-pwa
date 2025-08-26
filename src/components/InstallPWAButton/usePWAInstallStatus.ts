'use client';

import { useEffect, useState } from 'react';

export type PWAInstallStatus =
    | 'checking' // Проверяем статус
    | 'installed' // Приложение уже установлено
    | 'installable' // Доступно для установки
    | 'not-supported' // Браузер не поддерживает PWA
    | 'not-installable'; // PWA не готово к установке

export function usePWAInstallStatus() {
    const [status, setStatus] = useState<PWAInstallStatus>('checking');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const checkInstallStatus = () => {
            // Проверяем, запущено ли приложение в standalone режиме
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

            // Проверяем для iOS Safari
            const isIOSStandalone = (window.navigator as any).standalone === true;

            // Дополнительная проверка для Android WebView
            const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
            const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;

            // Проверяем referrer для PWA режима
            const referrerCheck = document.referrer === '' || document.referrer.includes('android-app://');

            const isPWAMode = isStandalone || isIOSStandalone || isMinimalUI || isFullscreen;

            if (isPWAMode) {
                setStatus('installed');
                return;
            }

            // Проверяем базовую поддержку PWA
            const hasServiceWorkerSupport = 'serviceWorker' in navigator;
            const hasManifestSupport = 'serviceWorker' in navigator && 'PushManager' in window;

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

    // Функция для получения текстового описания статуса
    const getStatusText = (): string => {
        switch (status) {
            case 'checking':
                return 'Проверяем возможность установки...';
            case 'installed':
                return 'Приложение уже установлено';
            case 'installable':
                return 'Приложение можно установить';
            case 'not-supported':
                return 'Браузер не поддерживает установку PWA';
            case 'not-installable':
                return 'Приложение не готово к установке';
            default:
                return 'Неизвестный статус';
        }
    };

    return {
        status,
        statusText: getStatusText(),
        isInstalled: status === 'installed',
        isInstallable: status === 'installable',
        isSupported: status !== 'not-supported',
        isChecking: status === 'checking',
    };
}
