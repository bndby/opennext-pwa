'use client';

import { useAddToHomescreenPrompt } from './useAddToHomescreenPrompt';
import { usePWAInstallStatus } from './usePWAInstallStatus';
import { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Alert,
    Card,
    CardContent,
    CardActions,
    Chip,
    CircularProgress,
    Box,
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    GetApp as GetAppIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
} from '@mui/icons-material';

export default function InstallPWAButton() {
    const [, promptToInstall] = useAddToHomescreenPrompt();
    const { status, statusText, isInstalled, isInstallable, browserRecommendation, isDesktop } = usePWAInstallStatus();
    const [showDialog, setShowDialog] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isInstalling, setIsInstalling] = useState(false);

    const getStatusLabel = (): string => {
        switch (status) {
            case 'checking':
                return 'Проверяем...';
            case 'installed':
                return 'Установлено';
            case 'installable':
                return 'Готово к установке';
            case 'not-supported':
                return 'Не поддерживается';
            case 'not-installable':
                return 'Недоступно';
            default:
                return status;
        }
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleInstall = async () => {
        try {
            setIsInstalling(true);
            setError(null);
            await promptToInstall();
            setShowDialog(false);
            // После успешной установки статус обновится автоматически
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка при установке');
        } finally {
            setIsInstalling(false);
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'checking':
                return <CircularProgress size={20} />;
            case 'installed':
                return <CheckCircleIcon color="success" />;
            case 'installable':
                return <GetAppIcon color="primary" />;
            case 'not-supported':
                return <ErrorIcon color="error" />;
            case 'not-installable':
                return <InfoIcon color="warning" />;
            default:
                return <InfoIcon />;
        }
    };

    const getStatusColor = (): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
        switch (status) {
            case 'installed':
                return 'success';
            case 'installable':
                return 'primary';
            case 'not-supported':
                return 'error';
            case 'not-installable':
                return 'warning';
            default:
                return 'default';
        }
    };

    // Не рендерим ничего до монтирования на клиенте
    if (!isClient) {
        return null;
    }

    return (
        <>
            <Card variant="outlined" sx={{ maxWidth: 600, mx: 'auto' }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        {getStatusIcon()}
                        <Typography variant="h6" component="h2">
                            Статус PWA приложения
                        </Typography>
                        <Chip label={getStatusLabel()} color={getStatusColor()} size="small" />
                    </Box>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        {statusText}
                    </Typography>

                    {isInstalled && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Отлично! Вы используете установленную версию PWA приложения. Приложение работает в
                            автономном режиме и имеет доступ ко всем функциям.
                        </Alert>
                    )}

                    {status === 'not-supported' && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {isDesktop
                                ? 'Ваш браузер не поддерживает установку PWA приложений на компьютер.'
                                : 'Ваш браузер не поддерживает установку PWA приложений.'}
                            {browserRecommendation && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {browserRecommendation}
                                </Typography>
                            )}
                        </Alert>
                    )}

                    {status === 'not-installable' && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            PWA приложение не готово к установке. Возможные причины:
                            <ul>
                                <li>Приложение уже было установлено ранее</li>
                                <li>Не выполнены критерии установки PWA</li>
                                <li>Необходимо больше взаимодействий с сайтом</li>
                            </ul>
                            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'medium' }}>
                                Совет: Попробуйте перезагрузить страницу или убедитесь, что сайт открыт по HTTPS.
                            </Typography>
                        </Alert>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                </CardContent>

                {isInstallable && (
                    <CardActions>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<GetAppIcon />}
                            onClick={() => setShowDialog(true)}
                            fullWidth
                        >
                            {isDesktop ? 'Установить на компьютер' : 'Установить приложение'}
                        </Button>
                    </CardActions>
                )}
            </Card>

            {/* Диалог подтверждения установки */}
            <Dialog open={showDialog} onClose={() => setShowDialog(false)} aria-labelledby="install-pwa-dialog-title">
                <DialogTitle id="install-pwa-dialog-title">
                    {isDesktop ? 'Установить настольное приложение' : 'Установить PWA приложение'}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {isDesktop
                            ? 'Хотите установить это приложение на компьютер как настольное приложение?'
                            : 'Хотите установить это приложение на главный экран для быстрого доступа?'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        После установки приложение будет:
                    </Typography>
                    <ul>
                        <li>Работать в автономном режиме</li>
                        <li>Загружаться быстрее</li>
                        <li>
                            {isDesktop
                                ? 'Появится в меню "Пуск" и на рабочем столе'
                                : 'Иметь собственную иконку на главном экране'}
                        </li>
                        <li>
                            {isDesktop
                                ? 'Работать как обычная программа с собственным окном'
                                : 'Работать как обычное приложение'}
                        </li>
                        {isDesktop && <li>Открываться без адресной строки браузера</li>}
                    </ul>
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDialog(false)} disabled={isInstalling}>
                        Отмена
                    </Button>
                    <Button
                        onClick={handleInstall}
                        variant="contained"
                        color="primary"
                        autoFocus
                        disabled={isInstalling}
                        startIcon={isInstalling ? <CircularProgress size={20} /> : <GetAppIcon />}
                    >
                        {isInstalling ? 'Устанавливаем...' : 'Установить'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
