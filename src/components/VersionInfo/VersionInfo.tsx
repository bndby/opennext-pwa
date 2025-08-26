'use client';

import { Typography, Box, Chip } from '@mui/material';
import { useEffect, useState } from 'react';

interface VersionInfoProps {
    /**
     * Статическая информация о коммите, переданная с сервера
     */
    commitInfo?: {
        shortHash: string;
        formattedDate: string;
        message?: string;
    } | null;
    /**
     * Размещение компонента
     */
    placement?: 'footer' | 'inline';
    /**
     * Показывать ли сообщение коммита
     */
    showMessage?: boolean;
}

export function VersionInfo({ commitInfo, placement = 'footer', showMessage = false }: VersionInfoProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Не показываем ничего до монтирования компонента
    if (!mounted) {
        return null;
    }

    // Если нет информации о коммите, показываем дату сборки
    if (!commitInfo || !commitInfo.shortHash) {
        return (
            <Box
                sx={{
                    textAlign: placement === 'footer' ? 'center' : 'left',
                    mt: placement === 'footer' ? 4 : 1,
                    opacity: 0.6,
                }}
            >
                <Typography variant="caption" color="text.secondary">
                    Версия: dev
                </Typography>
            </Box>
        );
    }

    const isFooter = placement === 'footer';

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: isFooter ? 'column' : 'row',
                alignItems: isFooter ? 'center' : 'flex-start',
                gap: isFooter ? 1 : 2,
                mt: isFooter ? 4 : 1,
                opacity: 0.7,
                flexWrap: 'wrap',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                    label={`v${commitInfo.shortHash}`}
                    size="small"
                    variant="outlined"
                    sx={{
                        fontSize: '0.7rem',
                        height: 20,
                        fontFamily: 'monospace',
                    }}
                />
                <Typography variant="caption" color="text.secondary">
                    {commitInfo.formattedDate}
                </Typography>
            </Box>

            {showMessage && commitInfo.message && (
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        maxWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {commitInfo.message}
                </Typography>
            )}
        </Box>
    );
}

export default VersionInfo;
