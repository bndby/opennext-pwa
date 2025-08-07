'use client';

import { Stack, TextField, Alert, CircularProgress, Typography } from '@mui/material';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import setupIndexedDB, { useIndexedDBStore } from 'use-indexeddb';

const idbConfig = {
    databaseName: 'opennext-pwa',
    version: 1,
    stores: [
        {
            name: 'test',
            id: { keyPath: 'id', autoIncrement: true },
            indices: [{ name: 'content', keyPath: 'content' }],
        },
    ],
};

export const IndexDB = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        setupIndexedDB(idbConfig)
            .then(() => {
                console.log('IndexedDB initialized successfully');
                setIsInitialized(true);
            })
            .catch((e) => {
                console.error('IndexedDB initialization error:', e);
                setError('Ошибка инициализации IndexedDB: ' + e.message);
            });
    }, []);

    const { add, getAll } = useIndexedDBStore<{ content: string }>('test');

    const [content, setContent] = useState('');

    const handleSave = async () => {
        if (!content.trim()) {
            setError('Введите текст для сохранения');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const id = await add({
                content: content,
            });
            console.log(`Added with ID ${id}`);
            setContent('');
        } catch (err) {
            console.error('Save error:', err);
            setError('Ошибка сохранения: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoad = async () => {
        setIsLoading(true);
        setError('');

        try {
            const data = await getAll();
            const str = data.map((d) => d.content).join('\n');
            setContent(str);
        } catch (err) {
            console.error('Load error:', err);
            setError('Ошибка загрузки: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
        } finally {
            setIsLoading(false);
        }
    };

    if (!isInitialized) {
        return (
            <Stack spacing={2}>
                <CircularProgress />
                <Typography>Инициализация IndexedDB...</Typography>
            </Stack>
        );
    }

    return (
        <>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TextField
                id="outlined-basic"
                multiline
                minRows={3}
                maxRows={10}
                label="Текст"
                variant="outlined"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isLoading}
                fullWidth
            />

            <Stack spacing={2} direction="row" sx={{ marginTop: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={isLoading || !content.trim()}
                >
                    {isLoading ? <CircularProgress size={20} /> : 'Сохранить'}
                </Button>
                <Button variant="contained" color="secondary" onClick={handleLoad} disabled={isLoading}>
                    {isLoading ? <CircularProgress size={20} /> : 'Загрузить'}
                </Button>
            </Stack>
        </>
    );
};
