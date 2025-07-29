import { Page } from '@/components/Page/Page';
import { NetworkStatus } from '@/components/NetworkInformation/NetworkStatus';
import { Typography } from '@mui/material';
import { NetworkInformation } from '@/components/NetworkInformation/NetworkInformation';

export default function NetworkInformationPage() {
    return (
        <Page title="Информация о сети">
            <Typography variant="h5">Информация о сети</Typography>

            <p>
                Пример работы с{' '}
                <a href="https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API">
                    Network Information API
                </a>
                .
            </p>

            <p>
                <Typography variant="h6">Статус сети</Typography>
                <NetworkStatus />
            </p>

            <p>
                <Typography variant="h6">Информация о сети</Typography>
                <NetworkInformation />
            </p>
        </Page>
    );
}
