import DeviceMotion from '@/components/DeviceMotion/DeviceMotion';
import { Page } from '@/components/Page/Page';
import { Typography } from '@mui/material';

export default function MediaPage() {
    return (
        <Page title="Акселерометр">
            <Typography variant="h5">Акселерометр</Typography>

            <p>Пример работы с акселерометром устройства</p>

            <DeviceMotion />
        </Page>
    );
}
