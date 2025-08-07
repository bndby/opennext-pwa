'use client';

import { useNetworkStatus } from './useNetworkInformation';

export const NetworkInformation = () => {
    const { connection, isSupported, isClient } = useNetworkStatus();

    // Не рендерим ничего до монтирования на клиенте
    if (!isClient) {
        return <div>Загрузка...</div>;
    }

    if (!isSupported) {
        return <div>Network Information API не поддерживается в вашем браузере</div>;
    }

    if (!connection) {
        return <div>No connection</div>;
    }

    return (
        <div>
            <p>Effective type: {connection.effectiveType}</p>
            <p>Downlink: {connection.downlink} Mb/sec</p>
            <p>Downlink max: {connection.downlinkMax} Mb/sec</p>
            <p>RTT: {connection.rtt} ms</p>
            <p>Save data: {connection.saveData ? 'Yes' : 'No'}</p>
            <p>Type: {connection.type}</p>
        </div>
    );
};
