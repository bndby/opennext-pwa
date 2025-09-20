import { Vibration } from '@/components/Vibration/Vibration';
import { Page } from '@/components/Page/Page';
import { Typography } from '@mui/material';
import VibrationSupport from '@/components/Vibration/VibrationSupport';
import TouchEventsSupport from '@/components/TouchEvents/TouchEventsSupport';

export default function VibrationPage() {
    return (
        <Page title="Вибрация">
            <Typography variant="h5">Демонстрация Vibration API</Typography>

            <VibrationSupport />
            <TouchEventsSupport />

            <p>
                Пример работы с{' '}
                <a href="https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API">Vibration API</a>
            </p>

            <Vibration />
        </Page>
    );
}
