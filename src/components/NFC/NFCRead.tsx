'use client';

import { Button, Stack } from '@mui/material';
import { useRef, useState } from 'react';
import { useBrowserSupport } from '@/hooks/useBrowserSupport';
import { useClientSide } from '@/hooks/useClientSide';

export default function NFCRead() {
    const [status, setStatus] = useState('');
    const [data, setData] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const isClient = useClientSide();
    const isSupported = useBrowserSupport('NDEFReader');
    const abortController = useRef<AbortController>();

    const handleStartScan = async () => {
        if (!isSupported) {
            setStatus('NFC не поддерживается в вашем браузере');
            return;
        }

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

    // Не рендерим ничего до монтирования на клиенте
    if (!isClient) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <Stack direction="row" spacing={2}>
                <Button onClick={handleStartScan} disabled={isScanning || !isSupported} variant="contained">
                    Read NFC
                </Button>
                <Button onClick={handleStopScan} disabled={!isScanning} variant="contained">
                    Stop Scan
                </Button>
            </Stack>
            <p>{status}</p>
            <pre>{data}</pre>
            {!isSupported && <p style={{ color: 'red' }}>NFC не поддерживается в вашем браузере</p>}
        </div>
    );
}
