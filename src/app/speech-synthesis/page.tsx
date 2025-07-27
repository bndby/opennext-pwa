import { Page } from '@/components/Page/Page';
import { Speech } from '@/components/SpeechSynthesis/Speech';
import { Typography } from '@mui/material';

export default function SpeechSynthesisPage() {
    return (
        <Page title="Генерация голоса">
            <Typography variant="h5">Генерация голоса</Typography>

            <p>
                Пример работы с{' '}
                <a href="https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis">SpeechSynthesis</a>.
            </p>

            <Speech />
        </Page>
    );
}
