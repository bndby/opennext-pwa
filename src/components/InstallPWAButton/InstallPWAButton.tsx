'use client';

import { useAddToHomescreenPrompt } from '@/hooks/useAddToHomescreenPrompt';
import { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Alert } from '@mui/material';

export default function InstallPWAButton() {
    const [prompt, promptToInstall] = useAddToHomescreenPrompt();
    const [isVisible, setVisibleState] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const hide = () => {
        setVisibleState(false);
        setError(null);
    };

    useEffect(() => {
        if (prompt) {
            setVisibleState(true);
        }
    }, [prompt]);

    const handleInstall = async () => {
        try {
            await promptToInstall();
            hide();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка при установке');
        }
    };

    // Не рендерим ничего до монтирования на клиенте
    if (!isClient) {
        return null;
    }

    if (!isVisible) {
        return null;
    }

    return (
        <Dialog open={isVisible} onClose={hide} aria-labelledby="install-pwa-dialog-title">
            <DialogTitle id="install-pwa-dialog-title">Установить приложение</DialogTitle>
            <DialogContent>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Хотите установить это приложение на главный экран для быстрого доступа?
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={hide} color="secondary">
                    Отмена
                </Button>
                <Button onClick={handleInstall} variant="contained" color="primary" autoFocus>
                    Установить
                </Button>
            </DialogActions>
        </Dialog>
    );
}
