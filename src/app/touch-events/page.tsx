import { Page } from '@/components/Page/Page';
import TouchEventsSupport from '@/components/TouchEvents/TouchEventsSupport';
import { Typography } from '@mui/material';

export default function TouchEventsPage() {
    return (
        <Page title="Touch Events API">
            <Typography variant="h5">Touch Events API</Typography>

            <p>
                Пример работы с{' '}
                <a href="https://developer.mozilla.org/en-US/docs/Web/API/Touch_events">Touch Events API</a>
            </p>

            <TouchEventsSupport />
        </Page>
    );
}
