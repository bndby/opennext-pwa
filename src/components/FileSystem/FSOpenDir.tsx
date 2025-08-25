'use client';

import { Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useBrowserSupport } from '@/hooks/useBrowserSupport';
import { useClientSide } from '@/hooks/useClientSide';

export default function FSOpenDir() {
    const [text, setText] = useState('');
    const isClient = useClientSide();
    const isSupported = useBrowserSupport('showDirectoryPicker');

    const handleOpenDir = async () => {
        if (!isSupported) {
            alert('File System Access API не поддерживается в вашем браузере');
            return;
        }

        try {
            const dirHandle = await window.showDirectoryPicker();
            const promises = [];
            for await (const entry of dirHandle.values()) {
                if (entry.kind !== 'file') {
                    continue;
                }
                promises.push(entry.getFile().then((file) => `${file.name} (${file.size})`));
            }
            const text = await Promise.all(promises);
            setText(text.join('\n'));
        } catch (error) {
            console.error('Ошибка при открытии папки:', error);
        }
    };

    // Не рендерим ничего до монтирования на клиенте
    if (!isClient) {
        return <div>Загрузка...</div>;
    }

    return (
        <Stack direction="row" spacing={2}>
            <Button onClick={handleOpenDir} variant="contained" disabled={!isSupported}>
                Открыть папку
            </Button>
            <Button onClick={() => setText('')} variant="outlined">
                Очистить
            </Button>
            <pre>{text}</pre>
            {!isSupported && <p style={{ color: 'red' }}>File System Access API не поддерживается в вашем браузере</p>}
        </Stack>
    );
}
