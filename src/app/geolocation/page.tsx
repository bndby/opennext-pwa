import { Page } from '@/components/Page/Page';
import WatchLocation from '@/components/WatchLocation/WatchLocation';
import { Typography } from '@mui/material';

export default function MediaPage() {
    return (
        <Page title="Геолокация">
            <Typography variant="h5">Геолокация</Typography>

            <p>Пример работы с геолокацией устройства</p>

            <WatchLocation />
        </Page>
    );
}
