'use client';

import * as React from 'react';

export interface IBeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

/**
 * Единый источник beforeinstallprompt — не дублировать слушатель в других хуках.
 */
export function useAddToHomescreenPrompt(): [IBeforeInstallPromptEvent | null, () => Promise<void>] {
    const [prompt, setState] = React.useState<IBeforeInstallPromptEvent | null>(null);

    const promptToInstall = async (): Promise<void> => {
        if (prompt) {
            return prompt.prompt();
        }
        throw new Error('Tried installing before browser sent "beforeinstallprompt" event');
    };

    React.useEffect(() => {
        const ready = (e: Event) => {
            e.preventDefault();
            setState(e as IBeforeInstallPromptEvent);
        };

        const onInstalled = () => {
            setState(null);
        };

        window.addEventListener('beforeinstallprompt', ready);
        window.addEventListener('appinstalled', onInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', ready);
            window.removeEventListener('appinstalled', onInstalled);
        };
    }, []);

    return [prompt, promptToInstall];
}
