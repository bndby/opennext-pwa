'use client';

import { Button, Stack } from '@mui/material';
import { useState } from 'react';

export default function FSOpenDir() {
    const [text, setText] = useState('');

    return (
        <Stack direction="row" spacing={2}>
            <Button
                onClick={async () => {
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
                }}
                variant="contained"
            >
                Открыть папку
            </Button>
            <Button onClick={() => setText('')} variant="outlined">
                Очистить
            </Button>
            <pre>{text}</pre>
        </Stack>
    );
}
