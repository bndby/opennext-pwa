'use client';

import { useState } from 'react';
import { Button, Stack } from '@mui/material';

export default function FSOpenText() {
    const [text, setText] = useState('');

    return (
        <Stack direction="row" spacing={2}>
            <Button
                onClick={async () => {
                    const fileHandle = await window.showOpenFilePicker();
                    const file = await fileHandle[0].getFile();
                    const text = await file.text();
                    setText(text);
                }}
                variant="contained"
            >
                Открыть текстовый файл
            </Button>
            <Button onClick={() => setText('')} variant="outlined">
                Очистить
            </Button>
            <p>{text}</p>
        </Stack>
    );
}
