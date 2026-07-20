'use client';

import { Button, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useBrowserSupport } from '@/hooks/useBrowserSupport';
import { useClientSide } from '@/hooks/useClientSide';
import { formatNdefMessage } from '@/lib/nfc';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';

function NFCReadInner() {
    const [status, setStatus] = useState('');
    const [data, setData] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const isClient = useClientSide();
    const isSupported = useBrowserSupport('NDEFReader');
    const abortController = useRef<AbortController | null>(null);
    const readerRef = useRef<NDEFReader | null>(null);

    useEffect(() => {
        return () => {
            abortController.current?.abort();
            abortController.current = null;
            readerRef.current = null;
        };
    }, []);

    const handleStartScan = async () => {
        if (!isSupported) {
            setStatus('NFC не поддерживается в вашем браузере');
            return;
        }

        setIsScanning(true);
        setStatus('Запуск сканирования…');

        try {
            abortController.current?.abort();
            abortController.current = new AbortController();

            const reader = new window.NDEFReader();
            readerRef.current = reader;

            await reader.scan({ signal: abortController.current.signal });

            setStatus((prev) => prev + '\nScan started successfully.');

            reader.onreadingerror = () => {
                setStatus((prev) => prev + '\nCannot read data from the NFC tag. Try another one?');
            };

            reader.onreading = (event: NDEFReadingEvent) => {
                setStatus((prev) => prev + `\nSerial: ${event.serialNumber}\nNDEF message read.`);
                const records = event.message?.records ?? [];
                setData(formatNdefMessage(records));
            };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Неизвестная ошибка NFC';
            // AbortError — ожидаемый результат Stop Scan
            if (err instanceof DOMException && err.name === 'AbortError') {
                setStatus((prev) => prev + '\nСканирование остановлено.');
            } else {
                setStatus((prev) => prev + `\nОшибка: ${message}`);
            }
            setIsScanning(false);
        }
    };

    const handleStopScan = () => {
        abortController.current?.abort();
        abortController.current = null;
        setIsScanning(false);
        setStatus((prev) => prev + '\nСканирование остановлено.');
    };

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
            <p style={{ whiteSpace: 'pre-wrap' }}>{status}</p>
            <pre>{data}</pre>
            {!isSupported && <p style={{ color: 'red' }}>NFC не поддерживается в вашем браузере</p>}
        </div>
    );
}

export default function NFCRead() {
    return (
        <ErrorBoundary title="Ошибка NFC">
            <NFCReadInner />
        </ErrorBoundary>
    );
}
