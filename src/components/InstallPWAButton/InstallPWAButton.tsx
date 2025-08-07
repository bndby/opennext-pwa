'use client';

import { useAddToHomescreenPrompt } from '@/hooks/useAddToHomescreenPrompt';
import { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';

export default function InstallPWAButton() {
    const [prompt, promptToInstall] = useAddToHomescreenPrompt();
    const [isVisible, setVisibleState] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const hide = () => setVisibleState(false);

    useEffect(() => {
        if (prompt) {
            setVisibleState(true);
        }
    }, [prompt]);

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
                <Typography variant="body1">
                    Хотите установить это приложение на главный экран для быстрого доступа?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={hide} color="secondary">
                    Отмена
                </Button>
                <Button
                    onClick={() => {
                        promptToInstall();
                        hide();
                    }}
                    variant="contained"
                    color="primary"
                    autoFocus
                >
                    Установить
                </Button>
            </DialogActions>
        </Dialog>
    );
}
