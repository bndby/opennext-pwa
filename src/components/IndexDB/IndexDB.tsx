'use client';

import { useIdb } from '@/hooks/useIndexDB';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { useState } from 'react';

export const IndexDB = () => {
    const [value, setValue] = useIdb('test', '{}');
    const [rawValue, setRawValue] = useState(JSON.stringify(value));

    return (
        <>
            <TextField
                id="outlined-basic"
                multiline
                minRows={3}
                maxRows={10}
                label="JSON"
                variant="outlined"
                value={rawValue}
                onChange={(e) => setRawValue(e.target.value)}
            />

            <hr />

            <Button variant="contained" color="primary" onClick={() => setValue(JSON.parse(rawValue))}>
                Save
            </Button>
        </>
    );
};
