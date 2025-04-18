'use client';

import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import setupIndexedDB, { useIndexedDBStore } from 'use-indexeddb';

const idbConfig = {
    databaseName: 'opennext-pwa',
    version: 1,
    stores: [
        {
            name: 'test-indexeddb',
            id: { keyPath: 'id', autoIncrement: false },
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

    const { update, getByID } = useIndexedDBStore<{ content: string }>('test-indexeddb');

    const [content, setContent] = useState('');

    const handleSave = () => {
        update({
            content: content,
        });
    };

    const handleLoad = () => {
        getByID(1).then((data: { content: string }) => {
            if (data && typeof data.content === 'string') {
                setContent(data.content);
            }
        });
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

            <hr />

            <Button variant="contained" color="primary" onClick={handleSave}>
                Save
            </Button>

            <Button variant="contained" color="primary" onClick={handleLoad}>
                Load
            </Button>
        </>
    );
};
