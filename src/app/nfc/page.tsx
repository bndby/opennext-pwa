import NFCRead from '@/components/NFC/NFCRead';
import NFCSupport from '@/components/NFC/NFCSupport';
import { Link } from 'next-view-transitions';
import { Page } from '@/components/Page/Page';
import { Typography } from '@mui/material';

export default function NFCPage() {
    return (
        <Page title="NFC">
            <Typography variant="h5">NFC</Typography>

            <NFCSupport />

            <Typography variant="body1">Пример работы с NFC</Typography>

            <ul>
                <li>
                    <Link href="https://developer.chrome.com/docs/capabilities/nfc?hl=ru">Гайд</Link>
                </li>
                <li>
                    <Link href="https://developer.mozilla.org/en-US/docs/Web/API/NDEFReader">Спецификация</Link>
                </li>
            </ul>

            <NFCRead />
        </Page>
    );
}
