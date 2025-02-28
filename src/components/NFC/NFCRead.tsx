'use client';

import { useRef, useState } from 'react';

export default function NFCRead() {
    const [status, setStatus] = useState('');
    const [data, setData] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const abortController = useRef<AbortController>();

    const handleStartScan = async () => {
        setIsScanning(true);
        const reader = new window.NDEFReader();
        abortController.current = new AbortController();

        await reader.scan({ signal: abortController.current.signal });

        setStatus((prev) => prev + '\nScan started successfully.');
        reader.onreadingerror = () => {
            setStatus((prev) => prev + '\nCannot read data from the NFC tag. Try another one?');
        };

        reader.onreading = (event: NDEFReadingEvent) => {
            setStatus((prev) => prev + '\n' + event.serialNumber);
            setStatus((prev) => prev + '\nNDEF message read.');
            setData(event.message.records[0].data);
        };
    };

    const handleStopScan = () => {
        abortController.current?.abort();
        setIsScanning(false);
    };

    return (
        <div>
            <button onClick={handleStartScan} disabled={isScanning}>
                Read NFC
            </button>
            <button onClick={handleStopScan} disabled={!isScanning}>
                Stop Scan
            </button>
            <p>{status}</p>
            <pre>{data}</pre>
        </div>
    );
}
