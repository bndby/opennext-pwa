import { Page } from '@/components/Page/Page';
import { Typography } from '@mui/material';

export default function Home() {
    return (
        <Page title="Opennext Cloudflare PWA">
            <Typography variant="h5">Opennext Cloudflare PWA</Typography>

            <Typography variant="body1">
                Приложение для демонстрации работы возможностей PWA-приложений на базе фреймворка OpenNext и хостинга
                Cloudflare.
            </Typography>
        </Page>
    );
}
