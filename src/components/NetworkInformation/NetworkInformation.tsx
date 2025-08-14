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
            <div>Effective type: {connection.effectiveType}</div>
            <div>Downlink: {connection.downlink} Mb/sec</div>
            <div>Downlink max: {connection.downlinkMax} Mb/sec</div>
            <div>RTT: {connection.rtt} ms</div>
            <div>Save data: {connection.saveData ? 'Yes' : 'No'}</div>
            <div>Type: {connection.type}</div>
        </div>
    );
};
