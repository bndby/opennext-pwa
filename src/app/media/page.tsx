import { MediaPWA } from '@/components/MediaPWA/MediaPWA';
import { Page } from '@/components/Page/Page';
import { Typography } from '@mui/material';

export default function MediaPage() {
    return (
        <Page title="Медиа">
            <Typography variant="h5">Медиа</Typography>

            <MediaPWA />
        </Page>
    );
}
