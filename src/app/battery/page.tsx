import { Battery } from '@/components/Battery/Battery';
import BatterySupport from '@/components/Battery/BatterySupport';
import { Page } from '@/components/Page/Page';
import { Typography } from '@mui/material';

/**
 * Страница демонстрации Battery Status API.
 */
export default function MediaPage() {
    return (
        <Page title="Батарея">
            <Typography variant="h5">Батарея</Typography>

            <BatterySupport />

            <p>
                Пример работы с{' '}
                <a href="https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API">батареей устройства</a>
            </p>

            <Battery />
        </Page>
    );
}
