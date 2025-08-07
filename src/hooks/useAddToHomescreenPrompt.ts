import * as React from 'react';

interface IBeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export function useAddToHomescreenPrompt(): [IBeforeInstallPromptEvent | null, () => Promise<void>] {
    const [prompt, setState] = React.useState<IBeforeInstallPromptEvent | null>(null);
    const [, setIsClient] = React.useState(false);

    const promptToInstall = async (): Promise<void> => {
        if (prompt) {
            return prompt.prompt();
        }
        throw new Error('Tried installing before browser sent "beforeinstallprompt" event');
    };

    React.useEffect(() => {
        setIsClient(true);

        const ready = (e: IBeforeInstallPromptEvent) => {
            e.preventDefault();
            setState(e);
        };

        window.addEventListener('beforeinstallprompt', ready as EventListener);

        return () => {
            window.removeEventListener('beforeinstallprompt', ready as EventListener);
        };
    }, []);

    return [prompt, promptToInstall];
}
