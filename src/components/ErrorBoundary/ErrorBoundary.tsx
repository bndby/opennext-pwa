'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Alert, AlertTitle, Button, Stack } from '@mui/material';

type ErrorBoundaryProps = {
    children: ReactNode;
    /** Заголовок ошибки для пользователя */
    title?: string;
    /** Fallback UI вместо дефолтного Alert */
    fallback?: ReactNode;
};

type ErrorBoundaryState = {
    error: Error | null;
};

/**
 * Ловит ошибки рендера в дочернем дереве (камера, карты, NFC и т.п.).
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, info.componentStack);
    }

    private handleReset = () => {
        this.setState({ error: null });
    };

    render() {
        const { error } = this.state;
        const { children, title = 'Что-то пошло не так', fallback } = this.props;

        if (error) {
            if (fallback) {
                return fallback;
            }

            return (
                <Alert severity="error" sx={{ my: 2 }}>
                    <AlertTitle>{title}</AlertTitle>
                    <Stack spacing={1}>
                        <span>{error.message || 'Неизвестная ошибка в компоненте'}</span>
                        <Button size="small" variant="outlined" onClick={this.handleReset} sx={{ alignSelf: 'flex-start' }}>
                            Попробовать снова
                        </Button>
                    </Stack>
                </Alert>
            );
        }

        return children;
    }
}
