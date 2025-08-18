import DeviceMotion from '@/components/DeviceMotion/DeviceMotion';
import { Page } from '@/components/Page/Page';
import { Typography } from '@mui/material';

export default function MediaPage() {
    return (
        <Page title="Акселерометр">
            <Typography variant="h5">Акселерометр</Typography>

            <p>
                Пример работы с{' '}
                <a href="https://developer.mozilla.org/en-US/docs/Web/API/Device_orientation_events">
                    акселерометром устройства
                </a>
            </p>

            <DeviceMotion />
        </Page>
    );
}
