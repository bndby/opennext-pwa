'use client';

import { Stack, TextField } from '@mui/material';
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
    useEffect(() => {
        setupIndexedDB(idbConfig)
            .then(() => console.log('success'))
            .catch((e) => console.error('error / unsupported', e));
    }, []);

    const { add, getAll } = useIndexedDBStore<{ content: string }>('test');

    const [content, setContent] = useState('');

    const handleSave = () => {
        add({
            content: content,
        })
            .then((d) => console.log(`Added with ID ${d}`))
            .catch(console.error);
    };

    const handleLoad = () => {
        getAll()
            .then((data) => {
                const str = data.map((d) => d.content).join('\n');
                setContent(str);
            })
            .catch(console.error);
    };

    return (
        <>
            <TextField
                id="outlined-basic"
                multiline
                minRows={3}
                maxRows={10}
                label="Text"
                variant="outlined"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <br />
            <Stack spacing={2} direction="row" sx={{ marginTop: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                </Button>{' '}
                <Button variant="contained" color="primary" onClick={handleLoad}>
                    Load
                </Button>
            </Stack>
        </>
    );
};
