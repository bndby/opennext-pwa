'use client';

import { useState } from 'react';

export default function NFCRead() {
    const [status, setStatus] = useState('');
    const [data, setData] = useState('');

    const handleScan = () => {
        const reader = new window.NDEFReader();
        reader
            .scan()
            .then(() => {
                setStatus('Scan started successfully.');
                reader.onreadingerror = () => {
                    console.log('Cannot read data from the NFC tag. Try another one?');
                };
                reader.onreading = (event: NDEFReadingEvent) => {
                    console.log('NDEF message read.');
                    const message = event.message;
                    for (const record of message.records) {
                        setData((prev) => prev + '\nRecord type:  ' + record.recordType);
                        setData((prev) => prev + '\nMIME type:    ' + record.mediaType);
                        setData((prev) => prev + '\nRecord id:    ' + record.id);
                    }
                };
            })
            .catch((error: unknown) => {
                console.log(`Error! Scan failed to start: ${error}.`);
            });
    };

    return (
        <div>
            <button onClick={handleScan}>Read NFC</button>
            <p>{status}</p>
            <pre>{data}</pre>
        </div>
    );
}
