import InstallPWAButton from '@/components/InstallPWAButton/InstallPWAButton';
import { Page } from '@/components/Page/Page';
import { Typography } from '@mui/material';

export default function InstallPWA() {
    return (
        <Page title="Установка PWA">
            <Typography variant="h5">Установка PWA</Typography>

            <InstallPWAButton />
        </Page>
    );
}
