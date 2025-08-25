'use client';

import { useState } from 'react';
import { Button, Stack } from '@mui/material';
import { useBrowserSupport } from '@/hooks/useBrowserSupport';
import { useClientSide } from '@/hooks/useClientSide';

export default function FSOpenText() {
    const [text, setText] = useState('');
    const isClient = useClientSide();
    const isSupported = useBrowserSupport('showOpenFilePicker');

    const handleOpenFile = async () => {
        if (!isSupported) {
            alert('File System Access API не поддерживается в вашем браузере');
            return;
        }

        try {
            const fileHandle = await window.showOpenFilePicker();
            const file = await fileHandle[0].getFile();
            const text = await file.text();
            setText(text);
        } catch (error) {
            console.error('Ошибка при открытии файла:', error);
        }
    };

    // Не рендерим ничего до монтирования на клиенте
    if (!isClient) {
        return <div>Загрузка...</div>;
    }

    return (
        <Stack direction="row" spacing={2}>
            <Button onClick={handleOpenFile} variant="contained" disabled={!isSupported}>
                Открыть текстовый файл
            </Button>
            <Button onClick={() => setText('')} variant="outlined">
                Очистить
            </Button>
            <p>{text}</p>
            {!isSupported && <p style={{ color: 'red' }}>File System Access API не поддерживается в вашем браузере</p>}
        </Stack>
    );
}
